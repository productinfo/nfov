import anchorme from 'anchorme'
import { ipcRenderer } from 'electron'
import AsciiFileLoader from '../../../fs/ascii-file-loader'
import * as storage from '../../../fs/storage'
import { openLinksInExternalBrowser } from '../../../utils/general-utils'
import anchormeOptions from '../anchorme-options'
import { setLinkColor } from '../ascii-document-style'
import DocumentRenderer from './document-renderer'

export default class AsciiRenderer implements DocumentRenderer {
    private container = document.getElementById('text_container')!
    private fileLoader = new AsciiFileLoader()

    public render(filePath: string): void {
        this.setText(this.loadText(filePath))
        this.updateLinksHighlighting()
        this.container.scrollIntoView()
        ipcRenderer.send(
            'window-size-changed',
            this.container.scrollWidth,
            this.container.clientHeight
        )
    }

    private setText(text: string): void {
        this.container.innerHTML = text
    }

    private loadText(filePath: string): string {
        let text = this.fileLoader.load(filePath)
        if (storage.getLinksHighlighting()) {
            text = anchorme(text, anchormeOptions)
        }
        return text
    }

    private updateLinksHighlighting(): void {
        if (storage.getLinksHighlighting()) {
            setLinkColor(storage.getLinkColor())
            openLinksInExternalBrowser()
        }
    }
}
