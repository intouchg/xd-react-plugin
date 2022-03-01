require('./react-shim')
const React = require('react')
const ReactDOM = require('react-dom')
const ComponentsPanel = require('./ComponentsPanel.jsx')
const PanelController = require('./controllers/PanelController')

const componentsPanel = new PanelController(ComponentsPanel)

module.exports = {
    panels: {
        componentsPanel,
    },
}