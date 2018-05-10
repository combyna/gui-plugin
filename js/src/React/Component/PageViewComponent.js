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

export default class PageViewComponent extends React.Component {
    constructor (props) {
        super(props);

        this.reactElementFactoryRepository = props.reactElementFactoryRepository;

        this.state = {
            visibleViewsState: props.client.createInitialState()
        };
    }

    renderWidget (widgetData) {
        if (widgetData.type === 'text') {
            return widgetData.text;
        }

        // TODO: decide whether to wrap primitive widgets in HOCs to map widgetData to props
        if (widgetData.type === 'widget') {
            return this.renderWidget(widgetData.root);
        }

        if (widgetData.type === 'generic') {
            // "Generically"-rendered widgets do not define their child structure with rendered elements -
            // instead, they each map to a React component which can then structure them as needed
            // const Component = this.reactElementFactoryRepository.getComponent(widgetData.library, widgetData.widget);
            //
            // return (
            //     <Component {...widgetData.attributes}>
            //         ...widgetData.children.map(childWidgetData => this.renderWidget(childWidgetData))
            //     </Component>
            // );

            const elementFactory = this.reactElementFactoryRepository.getFactory(widgetData.library, widgetData.widget);

            const dispatchEvent = (libraryName, eventName, eventPayload) => {

                // FIXME: Decide whether/where to stop propagation
                // event.stopPropagation();

                this.setState((previousState, props) => {
                    const newVisibleViewsState = props.client.dispatchEvent(
                        previousState.visibleViewsState,
                        widgetData.path,
                        libraryName,
                        eventName,
                        eventPayload || {}
                    );

                    return {
                        visibleViewsState: newVisibleViewsState
                    };
                });
            };

            // TODO: Actually pass these triggers (with their events) down from Combyna
            const triggers = [
                {library: 'gui', event: 'click'},
                {library: 'example_gui', event: 'close_me'}
            ];

            return elementFactory(
                widgetData.attributes,
                widgetData.children.map(childWidgetData => this.renderWidget(childWidgetData)),
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

            // if (widgetData.tag === 'button') {
                attributes.onClick = (event) => {

                    // FIXME: Decide whether/where to stop propagation
                    // event.stopPropagation();

                    this.setState((previousState, props) => {
                        const newVisibleViewsState = props.client.dispatchEvent(
                            previousState.visibleViewsState,
                            widgetData.path,
                            'gui',
                            'click',
                            {
                                // FIXME: Pass these in from the event data
                                x: 200,
                                y: 100
                            }
                        );

                        return {
                            visibleViewsState: newVisibleViewsState
                        };
                    });
                }
            // }

            return (
                widgetData.children.length
                    ? <widgetData.tag { ...attributes }>{ widgetData.children ? widgetData.children.map(this.renderWidget.bind(this)) : '' }</widgetData.tag>
                    : <widgetData.tag { ...attributes }/>
            );
        }

        const children = widgetData.children.map(this.renderWidget.bind(this));

        if (widgetData.type === 'fragment') {
            return children;
        }

        throw new Error(`Widget type "${widgetData.type}" is not supported`);
    }

    renderViewsData () {
        const renderedViewsData = this.props.client.renderVisibleViews(this.state.visibleViewsState);

        return renderedViewsData.map((viewData) => {
            return <div className="view">{ this.renderWidget(viewData.widget) }</div>;
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
