import * as vscode from 'vscode';
import { isInteger } from './utils';
import { generateCode } from './utils';

export function activate(context: vscode.ExtensionContext) {
  const commandHelper = async (
    OPENAI_API_KEY: string,
    model: string,
    filePath: string,
    start?: number,
    end?: number,
  ) => {
    vscode.window.showInformationMessage(`Loop: Generating With ${model}...`);
    let url = vscode.Uri.parse('file://' + filePath);
    let range: vscode.Range | null = null;
    let testFile: vscode.TextDocument | null = null;

    if (start && end) {
      range = new vscode.Range(new vscode.Position(start - 1, 0), new vscode.Position(end, 0));
    }

    try {
      testFile = await vscode.workspace.openTextDocument(url);
    } catch (error) {
      console.error('Loop Error: ', error);
      vscode.window.showInformationMessage('Error: Could Not Read Test File');
      return;
    }

    // current editor
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      return;
    }

    const { selection } = editor;
    const position = selection.active;
    const testCases = range ? testFile!.getText(range) : testFile!.getText();
    let completedCode = '';

    try {
      completedCode = await generateCode(testCases, OPENAI_API_KEY, model);
    } catch (error) {
      console.error('Loop Error: ', error);
      vscode.window.showInformationMessage('Error: Could Not Generate Code');
      return;
    }

    editor.edit((editor) => editor.insert(position, completedCode));
  };

  const commandGenerateCode = vscode.commands.registerCommand('loop.generateCode', async () => {
    const configurations = vscode.workspace.getConfiguration('loop');
    const OPENAI_API_KEY: string | undefined = configurations.get('openaiApiKey');
    const model: string | undefined = configurations.get('model');

    if (!OPENAI_API_KEY) {
      const selection = await vscode.window.showInformationMessage(
        'Error: You Have Not Provided a OpenAI API Key, Set It Up Now?',
        'Yes',
        'No',
      );

      if (selection === 'Yes') {
        vscode.commands.executeCommand('workbench.action.openSettings', 'loop.openaiApiKey');
      }
      return;
    }

    if (!model) {
      vscode.window.showInformationMessage('Error: Specify a Model to Use');
      return;
    }

    const testLocationQuery = await vscode.window.showInputBox({
      placeHolder: 'Test File Path',
      prompt: 'Provide a Absolute Path to Relevant Tests',
      ignoreFocusOut: true,
    });

    if (!testLocationQuery) {
      vscode.window.showInformationMessage('Error: Provide a Absolute Path to Relevant Tests');
      return;
    }

    await commandHelper(OPENAI_API_KEY, model, testLocationQuery);
  });

  const commandGenerateCodeRange = vscode.commands.registerCommand(
    'loop.generateCodeRange',
    async () => {
      const configurations = vscode.workspace.getConfiguration('loop');
      const OPENAI_API_KEY: string | undefined = configurations.get('openaiApiKey');
      const model: string | undefined = configurations.get('model');

      if (!OPENAI_API_KEY) {
        const selection = await vscode.window.showInformationMessage(
          'Error: You Have Not Provided a OpenAI API Key, Set It Up Now?',
          'Yes',
          'No',
        );

        if (selection === 'Yes') {
          vscode.commands.executeCommand('workbench.action.openSettings', 'loop.openaiApiKey');
        }
        return;
      }

      if (!model) {
        vscode.window.showInformationMessage('Error: Specify a Model to Use');
        return;
      }

      const testLocationQuery = await vscode.window.showInputBox({
        placeHolder: 'Test File Path',
        prompt: 'Provide An Absolute Path to Relevant Tests',
        ignoreFocusOut: true,
      });

      if (!testLocationQuery) {
        vscode.window.showInformationMessage('Error: Provide a Absolute Path to Relevant Tests');
        return;
      }

      const startRangeQuery = await vscode.window.showInputBox({
        placeHolder: 'Line Number',
        prompt: 'Provide the Test Start Line Number',
        value: '1',
      });

      if (!startRangeQuery || !isInteger(startRangeQuery)) {
        vscode.window.showInformationMessage('Error: Provide a Valid Start Line Number');
        return;
      }

      const endRangeQuery = await vscode.window.showInputBox({
        placeHolder: 'Line Number',
        prompt: 'Provide the Test End Line Number',
        value: '2',
      });

      if (!endRangeQuery || !isInteger(endRangeQuery)) {
        vscode.window.showInformationMessage('Error: Provide a Valid Start End Number');
        return;
      }

      await commandHelper(
        OPENAI_API_KEY,
        model,
        testLocationQuery,
        parseInt(startRangeQuery),
        parseInt(endRangeQuery),
      );
    },
  );

  context.subscriptions.push(commandGenerateCode, commandGenerateCodeRange);
}

export function deactivate() {}
