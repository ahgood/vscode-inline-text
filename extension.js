const vscode = require('vscode');

function inlineText() {
	const editor = vscode.window.activeTextEditor;

	if (!editor) return {};

	const document = editor.document;
	const documentText = document.getText();

	if (documentText === '') return {};

	let updatedDocumentText = '';

	documentText.split('\n').forEach((line) => {
		updatedDocumentText += line.trim();
	});

	const firstLine = document.lineAt(0);
	const lastLine = document.lineAt(document.lineCount - 1);
	const textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
	
	return { editor, textRange, updatedDocumentText };
}

function activate(context) {
	const disposableInlineText = vscode.commands.registerCommand('vscode-inline-text.inlineText', () => {
		const { editor, textRange, updatedDocumentText } = inlineText();
		if (!textRange || !updatedDocumentText) return;
		editor.edit(edit => edit.replace(textRange, updatedDocumentText));
	});

	const disposableBookmarkletify = vscode.commands.registerCommand('vscode-inline-text.createBookmarklet', () => {
		const { editor, textRange, updatedDocumentText } = inlineText();
		if (!textRange || !updatedDocumentText) return;
		const bookmarklet = `javascript:(()=>{${updatedDocumentText}})();`;
		editor.edit(edit => edit.replace(textRange, bookmarklet));
	});

	context.subscriptions.push(disposableInlineText);
	context.subscriptions.push(disposableBookmarkletify);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
