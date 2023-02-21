const vscode = require('vscode');

function getAllTextRage(document) {
	const firstLine = document.lineAt(0);
	const lastLine = document.lineAt(document.lineCount - 1);
	return new vscode.Range(firstLine.range.start, lastLine.range.end);
}

function inlineText() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) return {};

	const document = editor.document;
	const selection = editor.selection;
	const selectedText = document.getText(selection);
	const documentText = selectedText || document.getText();
	if (documentText === '') return {};

	let updatedDocumentText = '';

	documentText.split('\n').forEach((line) => {
		updatedDocumentText += line.trim();
	});

	const textRange = selectedText === '' ? getAllTextRage(document) : selection;
	
	return { editor, textRange, updatedDocumentText };
}

function activate(context) {
	const disposableInlineText = vscode.commands.registerCommand('vscode-inline-text.inlineText', () => {
		const { editor, textRange, updatedDocumentText } = inlineText();
		if (!textRange || !updatedDocumentText) return;
		editor.edit(edit => edit.replace(textRange, updatedDocumentText));
	});

	const disposableInlineTextAndCreateBookmarklet = vscode.commands.registerCommand('vscode-inline-text.createBookmarklet', () => {
		const { editor, textRange, updatedDocumentText } = inlineText();
		if (!textRange || !updatedDocumentText) return;
		const bookmarklet = `javascript:(()=>{${updatedDocumentText}})();`;
		editor.edit(edit => edit.replace(textRange, bookmarklet));
	});

	const disposableRevertBookmarklet = vscode.commands.registerCommand('vscode-inline-text.createBookmarklet', () => {
		const { editor, textRange, updatedDocumentText } = inlineText();
		if (!textRange || !updatedDocumentText) return;
		let revertedCode = decodeURIComponent(updatedDocumentText);
		// TODO: Support 3 types of the bookmarklet format:
		// javascript:(function(){...})();
		// javascript:(()=>{...})();
		// javascript:...;void();
	});

	context.subscriptions.push(disposableInlineText);
	context.subscriptions.push(disposableInlineTextAndCreateBookmarklet);
	context.subscriptions.push(disposableRevertBookmarklet);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
