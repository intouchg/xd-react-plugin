const { Rectangle, Ellipse, Path, Color, Text } = require('scenegraph')
const cloneDeep = require('lodash.clonedeep')

const createComponent = (componentData) => (overrideStyles) => {
	const styledComponent = cloneDeep(componentData)
	for (const state in overrideStyles) {
		styledComponent.root.styles[state] = Object.assign(
			{},
			styledComponent.root.styles[state],
			overrideStyles[state],
		)
	}
	return styledComponent
}

export const text = createComponent({
	name: 'Text',
	states: [ 'default' ],
	root: {
		name: 'Text',
		type: Text,
		styles: {
			default: {
				text: 'Hello world',
				fill: '#000000',
				fontSize: 16,
			},
		},
		children: [],
	},
})

export const dot = createComponent({
	name: 'Dot',
	states: [ 'default' ],
	root: {
		name: 'Icon',
		type: Ellipse,
		styles: {
			default: {
				width: 10,
				height: 10,
				radiusX: (node) => 0.5 * node.width,
				radiusY: (node) => 0.5 * node.width,
				fill: '#000000',
			},
		},
		children: [],
	},
})

export const checkmark = createComponent({
	name: 'Checkmark',
	states: [ 'default' ],
	root: {
		name: 'Icon',
		type: Path,
		styles: {
			default: {
				pathData: 'M9.473,2,4.2,7.415,1.727,5.081,0,6.808,4.2,10.87l7-7.143Z',
				width: 11.2,
				height: 8.87,
				fill: '#000000',
			},
		},
		children: [],
	},
})

export const chevron = createComponent({
	name: 'Chevron',
	states: [ 'default' ],
	root: {
		name: 'Icon',
		type: Path,
		styles: {
			default: {
				pathData: 'M4.68,11a.218.218,0,0,0-.168.072l-1.44,1.44a.232.232,0,0,0,0,.336l5.04,5.04a.232.232,0,0,0,.336,0l5.04-5.04a.232.232,0,0,0,0-.336l-1.44-1.44a.232.232,0,0,0-.336,0L8.28,14.5,4.848,11.072A.218.218,0,0,0,4.68,11Z',
				width: 10.56,
				height: 6.96,
				fill: '#000000',
			},
		},
		children: [],
	},
})

export const checkbox = createComponent({
    name: 'Checkbox',
    states: [ 'default', 'checked', 'disabled', 'checked-disabled' ],
    root: {
        name: 'Box',
        type: Rectangle,
        styles: {
            default: {
                width: 16,
                height: 16,
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
            checkmark({
				default: {
					fill: 'transparent',
					customize: (node, parentNode) => {
						const x = 0.5 * (parentNode.width - node.width)
						const y = 0.25 * (parentNode.height - node.height)
						node.moveInParentCoordinates(x, y)
					},
				},
				checked: {
					fill: '#ffffff',
				},
				'checked-disabled': {
					fill: '#ffffff',
				},
			}),
        ],
    }
})

export const radio = createComponent({
    name: 'Radio',
    states: [ 'default', 'checked', 'disabled', 'checked-disabled' ],
    root: {
        name: 'Circle',
        type: Ellipse,
        styles: {
            default: {
				width: 16,
				height: 16,
				radiusX: (node) => 0.5 * node.width,
				radiusY: (node) => 0.5 * node.width,
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
            dot({
				default: {
					width: 7,
					height: 7,
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
			}),
        ],
    }
})

export const toggle = createComponent({
	name: 'Toggle',
	states: [ 'default', 'checked' ],
	root: {
		name: 'Rounded Box',
		type: Rectangle,
		styles: {
			default: {
				width: 44,
				height: 24,
				fill: '#ffffff',
				stroke: '#767676',
				strokeWidth: 1,
				cornerRadii: (node) => ({
					topLeft: 0.55 * node.width,
					topRight: 0.55 * node.width,
					bottomRight: 0.55 * node.width,
					bottomLeft: 0.55 * node.width,
				}),
			},
			checked: {
				fill: '#0277f6',
				stroke: '#0277f6',
			},
		},
		children: [
			dot({
				default: {
					width: 15,
					height: 15,
					fill: '#0277f6',
					customize: (node, parentNode) => {
						node.moveInParentCoordinates(4.5, 4.5)
					}
				},
				checked: {
					fill: '#ffffff',
					customize: (node, parentNode) => {
						node.moveInParentCoordinates(24.5, 4.5)
					}
				},
			})
		],
	},
})

export const select = createComponent({
	name: 'Select',
	states: [ 'default', 'disabled' ],
	root: {
		name: 'Rounded Box',
		type: Rectangle,
		styles: {
			default: {
				width: 220,
				height: 28.5,
				fill: '#ffffff',
				stroke: '#000000',
				strokeWidth: 1,
			},
			disabled: {
				fill: '#f8f8f8',
				stroke: '#d1d1d1',
			}
		},
		children: [
			text({
				default: {
					customize: (node, parentNode) => {
						node.moveInParentCoordinates(4, 20)
					}
				},
				disabled: {
					fill: '#a6a6a6',
				},
			}),
			chevron({
				default: {
					width: 15,
					height: 15,
					customize: (node, parentNode) => {
						node.moveInParentCoordinates(parentNode.width - node.width - 4, 0.5)
					}
				},
				disabled: {
					fill: '#a6a6a6',
				},
			})
		],
	},
})