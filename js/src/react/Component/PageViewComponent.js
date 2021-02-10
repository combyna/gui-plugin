/**
 * Combyna base GUI plugin
 * Copyright (c) the Combyna project and contributors
 * https://github.com/combyna/gui-plugin
 *
 * Released under the MIT license
 * https://github.com/combyna/gui-plugin/raw/master/MIT-LICENSE.txt
 */

import React from 'react';

// TODO: PropTypes validation

export default class PageViewComponent extends React.PureComponent {
    constructor (props) {
        super(props);

        this.appState = props.appState;

        this.state = {
            renderedViewsData: null
        };
    }

    componentDidMount () {
        // Start the rendering process (asynchronous, as we need to talk to PHP-land)
        this.renderViews();
    }

    /**
     * Renders the data for a widget to a React element or plain text
     *
     * @param {Object} widgetData
     * @param {Object} widgetData.attributes
     * @param {Array} widgetData.children
     * @param {string} widgetData.library
     * @param {string} widgetData.tag
     * @param {Array} widgetData.triggers
     * @param {string} widgetData.type
     * @param {string} widgetData.widget
     * @param {string[]|number[]} widgetData.path
     * @param {string|number} key
     * @returns {Object|string}
     */
    renderWidget (widgetData, key) {
        if (widgetData.type === 'text') {
            return widgetData.text;
        }

        // TODO: Wrap primitive widgets in HOCs to map widgetData to props
        //       for handling things like value attr -> defaultValue prop (see below)
        if (widgetData.type === 'widget') {
            return this.renderWidget(widgetData.root, key);
        }

        if (widgetData.type === 'generic') {
            // "Generically"-rendered widgets do not define their child structure with rendered elements -
            // instead, they each map to a React component which can then structure them as needed
            const elementFactory = this.props.reactElementFactoryRepository.getFactory(widgetData.library, widgetData.widget);

            const dispatchEvent = async (libraryName, eventName, eventPayload) => {
                const newAppState = await this.props.client.dispatchEvent(
                    this.appState,
                    widgetData.path,
                    libraryName,
                    eventName,
                    eventPayload || {}
                );

                this.updateAppState(newAppState);
            };

            const attributes = Object.assign({}, widgetData.attributes, {
                key: key
            });
            const uniqueId = widgetData.path.join('-');

            return elementFactory(
                attributes,
                // TODO: Avoid using the index as the key where possible
                widgetData.children.map((childWidgetData, index) => this.renderWidget(childWidgetData, index)),
                widgetData.triggers,
                dispatchEvent,
                uniqueId
            );
        }

        if (widgetData.type === 'element') {
            const uniqueId = widgetData.path.join('-');
            const attributes = Object.assign({}, widgetData.attributes, {
                key: uniqueId
            });

            // TODO: Install these event listener props outside this component
            if (widgetData.tag === 'button' || widgetData.tag === 'a') {
                attributes.onClick = async (event) => {

                    // FIXME: Decide whether/where to stop propagation
                    event.stopPropagation();

                    event.preventDefault();

                    const newAppState = await this.props.client.dispatchEvent(
                        this.appState,
                        widgetData.path,
                        'gui',
                        'click',
                        {
                            x: event.clientX,
                            y: event.clientY
                        }
                    );

                    this.updateAppState(newAppState);
                }
            }

            // TODO: Use HOCs to do this custom prop/ref manipulation (see above)
            if (widgetData.tag === 'input' || widgetData.tag === 'select' || widgetData.tag === 'textarea') {
                // For fields, use a callback ref to give us access to the rendered DOM element
                // so that we can fetch its value(s)/UI state
                attributes.ref = (element) => {
                    this.props.valueProviderRepository.setReferencedWidgetElement(widgetData.path, element);
                };

                // Support data binding by redrawing the page (if applicable)
                // when a field is edited
                // TODO: Optimise this to only add this change listener when the widget
                //       sets a capture using an expression that reads one of its widget values
                attributes.onChange = async () => {
                    const newAppState = await this.props.client.reevaluateUiState(this.appState);

                    this.updateAppState(newAppState);
                };
            }

            // TODO: Use HOC (see above)
            if (widgetData.tag === 'input') {
                if (attributes.type === 'text') {
                    // We use uncontrolled inputs in Combyna, to improve performance by reducing
                    // the amount of re-renders when editing a field and to better support browser extensions
                    // like password managers that might edit a field
                    attributes.defaultValue = attributes.value;
                    delete attributes.value;
                }
            }

            return (
                widgetData.children.length ?
                    <widgetData.tag { ...attributes }>
                        {
                            widgetData.children ?
                                // TODO: Avoid using the index as the key where possible
                                widgetData.children.map((childWidgetData, index) => this.renderWidget(childWidgetData, index)) :
                                []
                        }
                    </widgetData.tag> :
                    <widgetData.tag { ...attributes }/>
            );
        }

        // TODO: Avoid using the index as the key where possible
        const children = widgetData.children.map((childWidgetData, index) => this.renderWidget(childWidgetData, index));

        if (widgetData.type === 'fragment') {
            return children;
        }

        throw new Error(`Widget type "${widgetData.type}" is not supported`);
    }

    /**
     * Renders all visible views to a React element or plain text
     *
     * @returns {Object|string}
     */
    renderViewsData () {
        if (this.state.renderedViewsData === null) {
            // TODO: Use loading spinner or similar
            return 'Loading...';
        }

        return this.state.renderedViewsData.map((viewData) => {
            return (
                <div className="view" key={viewData['view-name']}>
                    { this.renderWidget(viewData.widget, null) }
                </div>
            );
        });
    }

    /**
     * Renders the current display to a React element
     *
     * @returns {Object}
     */
    render () {
        return (
            <div className="views">
                { this.renderViewsData() }
            </div>
        );
    }

    /**
     * Renders the visible views in PHP-land and then updates this React element's state
     * with the resulting data structure
     *
     * @return {Promise<void>}
     */
    async renderViews () {
        const renderedViewsData = await this.props.client.renderVisibleViews(this.appState);

        // Update the rendered views data on the React element state
        // so that we trigger a re-render as applicable
        this.setState({
            renderedViewsData: renderedViewsData
        });
    }

    /**
     * Updates the current Combyna AppState for this React element with a new one.
     * If the given AppState is identical to the current one then no work will be done.
     *
     * @param {AppStateInterface} newAppState
     */
    updateAppState (newAppState) {
        if (newAppState === this.appState) {
            // Combyna AppState has not changed; nothing to do
            return;
        }

        this.appState = newAppState;

        this.renderViews();
    }
}
