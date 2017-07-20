'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from "fs";
import * as less from 'less';
import * as lessPluginCSS from 'less-plugin-clean-css';
import path = require("path");

var lessChannel = vscode.window.createOutputChannel('LessBuilder');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "lessbuilder" is now active!');

    let less = new lessClass();

    let lessBuild = vscode.commands.registerCommand('extension.lessBuilder', () => {
        less.build();
    });

    let lessBuildMin = vscode.commands.registerCommand('extension.lessBuilderMin', () => {
        less.buildMin();
    });

    context.subscriptions.push(lessBuild);
    context.subscriptions.push(lessBuildMin);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

export class lessClass {
    constructor() {
        //
    }

    build()
    {
        let pathBase = vscode.window.activeTextEditor.document.fileName;
        let folder   = path.dirname(pathBase);
        let file     = path.basename(pathBase);

        lessChannel.show();
        lessChannel.append("Iniciando conversão\n");
        lessChannel.append("---------------------------\n");
        lessChannel.append("Diretório: "+folder+"\n");
        lessChannel.append("Arquivo Less: "+file+"\n");
        lessChannel.append("Arquivo CSS: "+file.replace('.less', '')+".css\n");
        lessChannel.append("---------------------------\n\n");

        fs.exists(pathBase, (exists) => {
            if(exists)
            {
                let input = fs.readFileSync(pathBase, 'utf8');

                less.render(input, { filename: path.resolve(pathBase), }, function (e, output) {
                    if (e!==null)
                    {
                        lessChannel.append("Erro ao gerar Less\n");
                        lessChannel.append(e+"\n");
                        return;
                    }

                    fs.writeFile(folder+'/'+file.replace('.less', '')+'.css', output.css, {flag: 'w+'}, function (err) {
                        if (err) throw err;
                        console.log("Arquivo salvo!\n");
                        vscode.window.showInformationMessage('CSS Gerado com sucesso!');

                        lessChannel.append("CSS gerado com sucesso!\n");
                        lessChannel.append("---------------------------\n\n\n");
                    });

                });
            }
            else
            {
                lessChannel.append("Arquivo não localizado\n");
                lessChannel.append("---------------------------\n\n\n");
            }
        });
    }

    buildMin()
    {
        let pathBase = vscode.window.activeTextEditor.document.fileName;
        let folder   = path.dirname(pathBase);
        let file     = path.basename(pathBase);

        lessChannel.show();
        lessChannel.append("Iniciando conversão\n");
        lessChannel.append("---------------------------\n");
        lessChannel.append("Diretório: "+folder+"\n");
        lessChannel.append("Arquivo Less: "+file+"\n");
        lessChannel.append("Arquivo CSS: "+file.replace('.less', '')+".min.css\n");
        lessChannel.append("---------------------------\n\n");

        fs.exists(pathBase, (exists) => {
            if(exists)
            {
                let input = fs.readFileSync(pathBase, 'utf8');
                let cleanCSSPlugin = new lessPluginCSS({advanced: true});

                less.render(input, { filename: path.resolve(pathBase), plugins: [cleanCSSPlugin], }, function (e, output) {
                    if (e!==null)
                    {
                        vscode.window.showErrorMessage('Erro ao gerar Less!');

                        lessChannel.append("Erro ao gerar Less\n");
                        lessChannel.append(e+"\n");
                        lessChannel.append("---------------------------\n\n\n");
                        return;
                    }

                    fs.writeFile(folder+'/'+file.replace('.less', '')+'.min.css', output.css, {flag: 'w+'}, function (err) {
                        if (err) throw err;
                        console.log("Arquivo salvo!\n");
                        vscode.window.showInformationMessage('CSS Gerado com sucesso!');

                        lessChannel.append("CSS gerado com sucesso!\n");
                        lessChannel.append("---------------------------\n\n\n");
                    });
                });
            }
            else
            {
                vscode.window.showWarningMessage('Arquivo não localizado');
                lessChannel.append("Arquivo não localizado!\n");
                lessChannel.append("---------------------------\n\n\n");
            }
        });
    }
}