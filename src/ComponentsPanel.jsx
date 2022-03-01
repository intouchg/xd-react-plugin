const React = require('react')
const commands = require('commands')
const { editDocument } = require('application')
const { Color } = require('scenegraph')
const components = require('./components')
const cloneDeep = require('lodash.clonedeep')

const ComponentsPanel = ({ selection }) => {
    const styleNode = (node, styles, parentNode) => {
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

	const createGroup = (nodes, groupName) => {
		selection.items = nodes.filter((node) => node)
		commands.group()
		const [ group ] = selection.items
		if (groupName) group.name = groupName
		return group
	}

    const createNode = (nodeData, state, rootComponentName, parentNode) => {
		const node = new nodeData.type()
		node.name = nodeData.name
        const styles = Object.assign(
            {},
            cloneDeep(nodeData.styles.default),
            cloneDeep(nodeData.styles[state]),
        )
		styleNode(node, styles, parentNode)
		selection.insertionParent.addChild(node)
		let childGroup
		if ('children' in nodeData && nodeData.children.length > 0) {
			childGroup = createGroup(nodeData.children.map((childNodeData) => {
                if ('root' in childNodeData) childNodeData = childNodeData.root
				return createNode(childNodeData, state, null, node)
            }), 'children')
		}
        if (rootComponentName) return createGroup([node, childGroup], rootComponentName)
        else return node
    }

    const drawComponent = (componentData) => {
        let index = 0
        while (index < (componentData.states || []).length) {
            const state = componentData.states[index]
            const rootNode = createNode(
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

    const handleClick = (type) =>
        (event) => editDocument(() => drawComponent(type()))

    return (
        <panel>
            {Object.entries(components).map(([ name, component ]) => (
                <div style={{ padding: '4px 0px' }} onClick={handleClick(component)}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                </div>
            ))}
        </panel>
    )
}

module.exports = ComponentsPanel