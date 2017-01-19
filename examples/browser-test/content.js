'use strict';

const script = document.createElement('script');
script.textContent = `
window._errors = [];
document.documentElement.addEventListener('inboxSDKerror', event => {
	window._errors.push(event.detail);
});
`;
document.documentElement.appendChild(script).remove();
document.documentElement.setAttribute('inboxsdk-emit-error-event', 'true');

function incrementStat(name) {
	document.head.setAttribute(
		name,
		Number(document.head.getAttribute(name))+1
	);
}

InboxSDK.load(1, 'simple-example', {inboxBeta:true}).then(sdk => {
	sdk.Compose.registerComposeViewHandler(composeView => {
		var button = composeView.addButton({
			title: 'Monkeys!',
			iconUrl: chrome.runtime.getURL('monkey.png'),
			hasDropdown: true,
			onClick(event) {
				event.dropdown.el.innerHTML = '<div class="extension-dropdown-test">foo</div>';
			},
			section: 'TRAY_LEFT'
		});
	});

	const arrowIconUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAYElEQVQ4y+2UMQ6AQAgEwfhQnnJP4adjc4UxB0ehhXqbULE7BRAUkLu1yQP6OXQveEab1DXTD0O9b53kIui+QReicnJ5lM2gArQA2LLcDCqAXYA2y1SgZ7BV/Lr+6TugB0K2GxxDXjEZAAAAAElFTkSuQmCC';

	const handledMessageViews = new WeakSet();
	const handledFileAttachmentCardViews = new WeakSet();

	sdk.Conversations.registerThreadViewHandler(threadView => {
		incrementStat('data-test-threadViewsSeen');

		const id = threadView.getThreadID();
		if (!/[0-9a-f]{12,16}/i.test(id)) {
			throw Object.assign(new Error('Bad thread id'), {id});
		}

		const messageViews = threadView.getMessageViewsAll();
		if (messageViews.length === 0) {
			throw new Error('No message views found');
		}
		setTimeout(() => {
			messageViews.forEach(messageView => {
				if (!handledMessageViews.has(messageView)) {
					throw new Error('No handler called for message view in thread');
				}
			});
		}, 0);
	});

	sdk.Conversations.registerMessageViewHandlerAll(messageView => {
		handledMessageViews.add(messageView);
	});

	sdk.Conversations.registerMessageViewHandler(messageView => {
		messageView.getFileAttachmentCardViews().forEach(cardView => {
			cardView.addButton({
				iconUrl: arrowIconUrl,
				tooltip: 'MV'
			});
		});

		if (messageView.isLoaded() !== true)
			throw new Error('message view was expected to be loaded');

		const id = messageView.getMessageID();
		if (!/[0-9a-f]{12,16}/i.test(id)) {
			throw Object.assign(new Error('Bad message id'), {id});
		}

		const cards = messageView.getFileAttachmentCardViews();
		if (cards.length > 0) {
			setTimeout(() => {
				cards.forEach(card => {
					if (!handledFileAttachmentCardViews.has(card)) {
						throw new Error('No handler called for card in message');
					}
				});
			}, 0);
		}
	});

	sdk.Conversations.registerFileAttachmentCardViewHandler(cardView => {
		handledFileAttachmentCardViews.add(cardView);
		cardView.addButton({
			iconUrl: arrowIconUrl,
			tooltip: 'CV'
		});
		const messageView = cardView.getMessageView();
		if (messageView) {
			incrementStat('data-test-messageViewsWithNativeCardsSeen');
			setTimeout(() => {
				if (!handledMessageViews.has(messageView)) {
					throw new Error('No handler called for message owning a card');
				}
			}, 0);
		}
	});
});
