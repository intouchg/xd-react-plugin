const React = require('react')
const commands = require('commands')
const { Rectangle, Color, Path } = require('scenegraph')
const { Checkbox } = require('./ids-components.cjs')

const componentData = {
    name: 'Checkbox',
    states: [ 'default', 'checked', 'disabled', 'checked-disabled' ],
    root: {
        name: 'Box',
        type: Rectangle,
        styles: {
            default: {
                width: 32,
                height: 32,
                strokeWidth: 1,
                fill: '#ffffff',
                stroke: '#767676',
                cornerRadii: (node) => ({
                    topLeft: 0.2 * node.width,
                    topRight: 0.2 * node.width,
                    bottomRight: 0.2 * node.width,
                    bottomLeft: 0.2 * node.width,
                }),
            },
            checked: {
                fill: '#0277f6',
                stroke: '#0277f6',
            },
            disabled: {
                fill: '#f8f8f8',
                stroke: '#d1d1d1',
            },
            'checked-disabled': {
                fill: '#d1d1d1',
                stroke: '#d1d1d1',
            },
        },
        children: [
            {
                name: 'Icon',
                type: Path,
                styles: {
                    default: {
                        pathData: 'M20.3 2l-11.3 11.6-5.3-5-3.7 3.7 9 8.7 15-15.3z',
                        width: 24,
                        height: 24,
                        fill: 'transparent',
                        customize: (node, parentNode) => {
                            const x = 0.5 * (parentNode.width - node.width)
                            const y = 0.5 * (parentNode.height - node.height)
                            node.moveInParentCoordinates(x, y)
                        },
                    },
                    checked: {
                        fill: '#ffffff',
                    },
                    'checked-disabled': {
                        fill: '#ffffff',
                    },
                },
                children: [],
            }
        ],
    }
}

class HelloForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = { name: '' }
        this.onInputChange = (e) => {
            this.setState({ name: e.target.value })
        }
        this.onDoneClick = (e) => {
            this.drawComponent(componentData)
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
                node[property] = styles[property](node, parentNode)
            }
            else if (typeof styles[property] === 'function') {
                node[property] = styles[property](node)
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
		this.props.selection.items = nodes
		commands.group()
		const [ group ] = this.props.selection.items
		if (groupName) group.name = groupName
		return group
	}

    createNode (nodeData, state, componentName, parentNode) {
        console.log(nodeData, state, componentName, parentNode)
		const node = new nodeData.type()
		node.name = nodeData.name
        const styles = Object.assign(
            {},
            nodeData.styles.default,
            nodeData.styles[state],
        )
		this.styleNode(node, styles, parentNode)
		this.props.selection.insertionParent.addChild(node)
		let childGroup
		if ('children' in nodeData && nodeData.children.length > 0) {
			childGroup = this.createGroup(nodeData.children.map((childNodeData) => 
				this.createNode(childNodeData, state, null, node)
			), 'children')
		}
        if (componentName) return this.createGroup([node, childGroup], componentName)
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
            console.log(rootNode)
            rootNode.moveInParentCoordinates(50 * index, 0)
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