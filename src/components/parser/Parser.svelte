<script lang="ts">
import type { Writable } from 'svelte/store';
import AutocompleteList from '$components/parser/AutocompleteList.svelte';
import { OpMeta } from '$components/parser/opmeta';
import { Parser, type StateConfig} from 'rain-sdk'
import { tick } from 'svelte';
    import { insert } from 'svelte/internal';

export let vmStateConfig: Writable<StateConfig>

const placeholderText = "EAGER_IF(EQUAL_TO(ITIERV2_REPORT(0xde61d65dbabc7274f18c747b6243b03e11933fec, CONTEXT[0]), MaxUint256), 0x00, SUB(MIN(MUL(SUB(BLOCK_TIMESTAMP, 0x633af02e), 0x0139b745a4261dac25ed), DIV(0x033b2e3c9fd0803ce8000000, 0x02)), MIN(MUL(SATURATING_SUB(ITIERV2_REPORT_TIME_FOR_TIER(THIS_ADDRESS, CONTEXT[0], 0x01), 0x633af02e), 0x0139b745a4261dac25ed), DIV(0x033b2e3c9fd0803ce8000000, 0x02))))"

let autocompleteSelection: Selection

const inputAction = (node: HTMLDivElement) => {

    let _textSegments

    const editorFocus = () => {
        if (node.innerHTML == placeholderText) node.innerHTML = ""
    }

    const autocomplete = async () => {
        autocompleteSelection = null
        await tick()
        var selectedNode = document.getSelection();
        // console.log(selectedNode)
        const type = selectedNode.anchorNode.parentElement.attributes?.['data-type']?.nodeValue
        if (type == 'unknown-op' && selectedNode.anchorOffset == selectedNode.anchorNode.length) {
            // console.log(selectedNode.anchorNode.textContent)
            // console.log(selectedNode.anchorNode.parentElement.attributes['data-index'].nodeValue)
            autocompleteSelection = selectedNode
        }
        
    }
 
    const getTextSegments = (element: ChildNode) => {
        const textSegments = [];
        Array.from(element.childNodes).forEach((node) => {
            switch(node.nodeType) {
                case Node.TEXT_NODE:
                    textSegments.push({text: node.nodeValue, node});
                    break;
                    
                case Node.ELEMENT_NODE:
                    textSegments.splice(textSegments.length, 0, ...(getTextSegments(node)));
                    break;
                    
                default:
                    throw new Error(`Unexpected node type: ${node.nodeType}`);
            }
        });
        return textSegments;
    }

    const updateEditor = () => {
        const sel = window.getSelection();
        const textSegments = getTextSegments(node);
        const textContent = textSegments.map(({text}) => text).join('');
        let anchorIndex = null;
        let focusIndex = null;
        let currentIndex = 0;
        textSegments.forEach(({text, node}) => {
            if (node === sel.anchorNode) {
                anchorIndex = currentIndex + sel.anchorOffset;
            }
            if (node === sel.focusNode) {
                focusIndex = currentIndex + sel.focusOffset;
            }
            currentIndex += text.length;
        });
        
        node.innerHTML = renderText(textContent);
        
        restoreSelection(anchorIndex, focusIndex);
        autocomplete();
    }


    const restoreSelection = (absoluteAnchorIndex, absoluteFocusIndex) => {
        const sel = window.getSelection();
        const textSegments = getTextSegments(node);
        let anchorNode = node;
        let anchorIndex = 0;
        let focusNode = node;
        let focusIndex = 0;
        let currentIndex = 0;
        textSegments.forEach(({text, node}) => {
            const startIndexOfNode = currentIndex;
            const endIndexOfNode = startIndexOfNode + text.length;
            if (startIndexOfNode <= absoluteAnchorIndex && absoluteAnchorIndex <= endIndexOfNode) {
                anchorNode = node;
                anchorIndex = absoluteAnchorIndex - startIndexOfNode;
            }
            if (startIndexOfNode <= absoluteFocusIndex && absoluteFocusIndex <= endIndexOfNode) {
                focusNode = node;
                focusIndex = absoluteFocusIndex - startIndexOfNode;
            }
            currentIndex += text.length;
        });
        
        sel.setBaseAndExtent(anchorNode,anchorIndex,focusNode,focusIndex);
    }

    const renderText = (text: string) => {
        console.log('tree', Parser.getParseTree(text, OpMeta))
        const parsedResult = Parser.getParseTree(text, OpMeta)
        $vmStateConfig = Parser.getStateConfig(text, OpMeta)
        const tree = parsedResult[0].tree

        if (!tree.length) return text

        let lastIndex = 0
        let textSegments = []

        const explode = (el) => {
            if (el?.opcode) {
                textSegments.push({text: text.slice(lastIndex, el?.opcode.position[0]), node: null, type: 'ignored'})
                textSegments.push({text: text.slice(el?.opcode.position[0], el?.opcode.position[1] + 1), node: el, type: 'op'})
                lastIndex = el?.opcode.position[1] + 1
            } else if (el.value) {
                textSegments.push({text: text.slice(lastIndex, el?.position[0]), node: null, type: 'ignored'})
                textSegments.push({text: text.slice(el?.position[0], el?.position[1] + 1), node: el, type: 'param'})
                lastIndex = el?.position[1] + 1
            } else if (el?.error && el.error.startsWith('unknown')) {
                textSegments.push({text: text.slice(lastIndex, el?.position[0]), node: null, type: 'ignored'})
                textSegments.push({text: text.slice(el?.position[0], el?.position[1] + 1), node: el, type: 'unknown-op'})
                lastIndex = el?.position[1] + 1
            } else {
                textSegments.push({text: text.slice(lastIndex, el?.position[1] + 1), node: null, type: 'ignored'})
                lastIndex = el?.position[1] + 1
            }
            if (el?.parameters) {
                el?.parameters.forEach(explode)
            }
        }
        
        tree.forEach(explode)
        textSegments.push({text: text.slice(lastIndex), node: null, type: 'ignored'})
        _textSegments = textSegments

        // console.log(textSegments)

        return textSegments.map((segment, i) => {
            if (segment.type == 'ignored') {
                return `<span data-type="ignored" data-index=${i}>${segment.text}</span>`
            }
            if (segment.type == 'op') {
                return `<span style="color:darkMagenta" data-type="op" data-index=${i}>${segment.text}</span>`
            }
            if (segment.type == 'unknown-op') {
                return `<span style="color:darkMagenta" data-type="unknown-op" data-index=${i}>${segment.text}</span>`
            }
            if (segment.type == 'param') {
                return `<span style="color:green" data-type="param" data-index=${i}>${segment.text}</span>`
            }
        }).join('')
    }

    const onPaste = (event) => {
        event.preventDefault();
        let paste = (event.clipboardData || window.clipboardData).getData('text');
        insertTextAtCaret(paste)
        updateEditor();
    };

    const insertTextAtCaret = (text) => {
    var sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            const node = document.createTextNode(text)
            range.insertNode(node);
            sel.setBaseAndExtent(node,text.length,node,text.length);
        }
    }
}

    node.addEventListener('paste', onPaste)
    node.addEventListener('input', updateEditor);
    node.addEventListener('focus', editorFocus)
}
</script>

<div class="rounded-lg border-gray-400 bg-gray-200 p-4  w-full font-mono h-full" use:inputAction contenteditable="true" spellcheck="false">
    {placeholderText}
</div>


{#if autocompleteSelection}
<AutocompleteList bind:autocompleteSelection {OpMeta} />
{/if}
    