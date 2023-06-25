import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const isInteger = (str: string) => !isNaN(parseFloat(str)) && Number.isInteger(parseFloat(str));

  const generateCode = async (
    AZURE_API_KEY: string,
    filePath: string,
    start?: number,
    end?: number,
  ) => {
    let url = vscode.Uri.parse('file://' + filePath);

    try {
      vscode.window.showInformationMessage('Loop: Generating...');

      const testFile = await vscode.workspace.openTextDocument(url);
      let range: vscode.Range | null = null;

      if (start && end) {
        range = new vscode.Range(new vscode.Position(start - 1, 0), new vscode.Position(end, 0));
      }

      // current editor
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const { selection } = editor;
        const position = selection.active;

        editor.edit((editor) => {
          if (range) {
            editor.insert(position, testFile.getText(range));
          } else {
            editor.insert(position, testFile.getText());
          }
        });
      }
    } catch (error) {
      console.error('Loop Error: ', error);
      vscode.window.showInformationMessage('Error: Could Not Read Test File');
    }
  };

  const commandGenerateCode = vscode.commands.registerCommand('loop.generateCode', async () => {
    const configurations = vscode.workspace.getConfiguration('loop');
    const AZURE_API_KEY: string | undefined = configurations.get('azureApiKey');

    if (!AZURE_API_KEY) {
      const selection = await vscode.window.showInformationMessage(
        'Error: You Have Not Provided a Azure API Key, Set It Up Now?',
        'Yes',
        'No',
      );

      if (selection === 'Yes') {
        vscode.commands.executeCommand('workbench.action.openSettings', 'loop.azureApiKey');
      }
      return;
    }

    const testLocationQuery = await vscode.window.showInputBox({
      placeHolder: 'Tests Path',
      prompt: 'Provide a Absolute Path to Relevant Tests',
      ignoreFocusOut: true,
    });

    if (!testLocationQuery) {
      vscode.window.showInformationMessage('Error: Provide a Absolute Path to Relevant Tests');
      return;
    }

    await generateCode(AZURE_API_KEY, testLocationQuery);
  });

  const commandGenerateCodeRange = vscode.commands.registerCommand(
    'loop.generateCodeRange',
    async () => {
      const configurations = vscode.workspace.getConfiguration('loop');
      const AZURE_API_KEY: string | undefined = configurations.get('azureApiKey');

      if (!AZURE_API_KEY) {
        const selection = await vscode.window.showInformationMessage(
          'Error: You Have Not Provided a Azure API Key, Set It Up Now?',
          'Yes',
          'No',
        );

        if (selection === 'Yes') {
          vscode.commands.executeCommand('workbench.action.openSettings', 'loop.azureApiKey');
        }
        return;
      }

      const testLocationQuery = await vscode.window.showInputBox({
        placeHolder: 'Tests Path',
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

      await generateCode(
        AZURE_API_KEY,
        testLocationQuery,
        parseInt(startRangeQuery),
        parseInt(endRangeQuery),
      );
    },
  );

  context.subscriptions.push(commandGenerateCode, commandGenerateCodeRange);
}

// This method is called when your extension is deactivated
export function deactivate() {}
