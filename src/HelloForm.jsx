const React = require('react')
const commands = require('commands')
const { Rectangle, Color, Path, Ellipse } = require('scenegraph')
const { Checkbox } = require('./ids-components.cjs')
const { checkmark, checkbox, dot, radio, toggle, select, text, chevron } = require('./components')
const cloneDeep = require('lodash.clonedeep')

class HelloForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { name: '' }
        this.onInputChange = (e) => {
            this.setState({ name: e.target.value })
        }
        this.onDoneClick = (e) => {
            this.drawComponent(select())
            props.dialog.close()
        }
    }

    /*
        Note that `parentNode` is not actually the direct parent of the XD `node` due
        to the way that child node groups are created. `node.parent !== parentNode`

        `parentNode` is actually the parent element from the node data that was used
        to construct the scene.
    */

    styleNode (node, styles, parentNode) {
        for (const property in styles) {
            if (property === 'customize') {
                styles[property](node, parentNode)
            }
            else if (typeof styles[property] === 'function') {
                node[property] = styles[property](node, parentNode)
            }
            else if (property === 'fill' || property === 'stroke') {
                node[property] = new Color(styles[property])
            }
            else {
                node[property] = styles[property]
            }
        }
    }

	createGroup (nodes, groupName) {
		this.props.selection.items = nodes.filter((node) => node)
		commands.group()
		const [ group ] = this.props.selection.items
		if (groupName) group.name = groupName
		return group
	}

    createNode (nodeData, state, rootComponentName, parentNode) {
		const node = new nodeData.type()
		node.name = nodeData.name
        const styles = Object.assign(
            {},
            cloneDeep(nodeData.styles.default),
            cloneDeep(nodeData.styles[state]),
        )
		this.styleNode(node, styles, parentNode)
		this.props.selection.insertionParent.addChild(node)
		let childGroup
		if ('children' in nodeData && nodeData.children.length > 0) {
			childGroup = this.createGroup(nodeData.children.map((childNodeData) => {
                if ('root' in childNodeData) childNodeData = childNodeData.root
				return this.createNode(childNodeData, state, null, node)
            }), 'children')
		}
        if (rootComponentName) return this.createGroup([node, childGroup], rootComponentName)
        else return node
    }

    drawComponent (componentData) {
        let index = 0
        while (index < (componentData.states || []).length) {
            const state = componentData.states[index]
            const rootNode = this.createNode(
                componentData.root,
                state,
                `${componentData.name}__${state}`
            )
            const { width = 50, height = 50 } = rootNode.localBounds
            rootNode.moveInParentCoordinates(
                (width * index) + (0.5 * width * (index + 1)),
                0.5 * height
            )
            index++
        }
    }

    render() {
        return (
            <form style={{ width: 300 }} onSubmit={this.onDoneClick}>
                <h1>React with JSX Components</h1>
                <label>
                    <span>What is your name?</span>
                    <input onChange={this.onInputChange} />
                </label>
                <p>{`Hello ${this.state.name}`}</p>
                <footer>
                    <button type="submit" uxp-variant="cta">Done</button>
                </footer>
                <Checkbox />
            </form>
        )
    }
}

module.exports = HelloForm