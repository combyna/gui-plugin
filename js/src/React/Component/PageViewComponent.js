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

        this.reactElementFactoryRepository = props.reactElementFactoryRepository;

        this.state = {
            appState: props.appState
        };

        this.valueProviderRepository = props.valueProviderRepository;
    }

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
            const elementFactory = this.reactElementFactoryRepository.getFactory(widgetData.library, widgetData.widget);

            const dispatchEvent = (libraryName, eventName, eventPayload) => {

                // FIXME: Decide whether/where to stop propagation
                // event.stopPropagation();

                this.setState((previousState, props) => {
                    const newAppState = props.client.dispatchEvent(
                        previousState.appState,
                        widgetData.path,
                        libraryName,
                        eventName,
                        eventPayload || {}
                    );

                    return newAppState === previousState.appState ?
                        previousState :
                        {
                            appState: newAppState
                        };
                });
            };

            // TODO: Actually pass these triggers (with their events) down from Combyna
            const triggers = [
                {library: 'gui', event: 'click'},
                {library: 'example_gui', event: 'close_me'}
            ];

            const attributes = Object.assign({}, widgetData.attributes, {
                key: key
            });

            return elementFactory(
                attributes,
                // TODO: Avoid using the index as the key where possible
                widgetData.children.map((childWidgetData, index) => this.renderWidget(childWidgetData, index)),
                triggers,
                dispatchEvent
            );
        }

        if (widgetData.type === 'element') {
            const uniqueID = widgetData.path.join('-');
            const attributes = Object.assign({}, widgetData.attributes, {
                key: uniqueID
            });



            // TODO: actually make this
            // const eventListenerProps = widgetData.triggerz.reduce((props, trigger) => {
            //     // create event props per event
            //     const eventProps = this.eventListenerFactory.createListeners(trigger.library, trigger.eventName)
            //
            //     // TODO: higher order function that takes all `onClick` functions and executes in order
            // TODO: create this
            // {
            //     onClick: [fn, fn, fn]
            // }
            //
            //     return Object.assign({}, props, eventProps);
            // }, {});

            // TODO: Install these event listener props outside this component
            if (widgetData.tag === 'button') {
                attributes.onClick = (event) => {

                    // FIXME: Decide whether/where to stop propagation
                    // event.stopPropagation();

                    this.setState((previousState, props) => {
                        const newAppState = props.client.dispatchEvent(
                            previousState.appState,
                            widgetData.path,
                            'gui',
                            'click',
                            {
                                // FIXME: Pass these in from the event data
                                x: 200,
                                y: 100
                            }
                        );

                        return newAppState === previousState.appState ?
                            previousState :
                            {
                                appState: newAppState
                            };
                    });
                }
            }

            // TODO: Use HOCs to do this custom prop/ref manipulation (see above)
            if (widgetData.tag === 'input' || widgetData.tag === 'select' || widgetData.tag === 'textarea') {
                // For fields, use a callback ref to give us access to the rendered DOM element
                // so that we can fetch its value(s)/UI state
                attributes.ref = (element) => {
                    this.valueProviderRepository.setReferencedWidgetElement(widgetData.path, element);
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
                                ''
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

    renderViewsData () {
        const renderedViewsData = this.props.client.renderVisibleViews(this.state.appState);

        return renderedViewsData.map((viewData) => {
            return (
                <div className="view" key={viewData['view-name']}>
                    { this.renderWidget(viewData.widget, null) }
                </div>
            );
        });
    }

    render () {
        return (
            <div className="views">
                { this.renderViewsData() }
            </div>
        )
    }
}
