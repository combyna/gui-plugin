import React from 'react';

// TODO: PropTypes validation

export default class PageViewComponent extends React.Component {
    constructor (props) {
        super(props);

        this.componentRepository = props.componentRepository;

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
            const Component = this.componentRepository.getComponent(widgetData.library, widgetData.widget);

            return (
                <Component {...widgetData.attributes}>
                    ...widgetData.children.map(childWidgetData => this.renderWidget(childWidgetData))
                </Component>
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
                    const newVisibleViewsState = this.props.client.dispatchEvent(
                        this.state.visibleViewsState,
                        widgetData.path,
                        'gui',
                        'click',
                        {
                            // FIXME: Pass these in from the event data
                            x: 200,
                            y: 100
                        }
                    );

                    event.stopPropagation();

                    this.setState({
                        visibleViewsState: newVisibleViewsState
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
