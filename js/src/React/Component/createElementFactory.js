/**
 * Combyna base GUI plugin
 * Copyright (c) the Combyna project and contributors
 * https://github.com/combyna/gui-plugin
 *
 * Released under the MIT license
 * https://github.com/combyna/gui-plugin/raw/master/MIT-LICENSE.txt
 */

import React from 'react';

const defaultMapAttributesToProps = attributes => attributes;
const defaultMapTriggersToProps = () => {};
const defaultMapUniqueIdToProps = () => {};

export default ({
    Component,
    builtinTriggerMappingRepository,
    mapAttributesToProps = defaultMapAttributesToProps,
    mapTriggersToProps = defaultMapTriggersToProps,
    mapUniqueIdToProps = defaultMapUniqueIdToProps
}) => {
    return (attributes, children, triggers, dispatchEvent, uniqueId) => {
        const props = {};

        const importTriggerMappings = (mappingGroupName) => {
            const propsForGroup = builtinTriggerMappingRepository.getPropsForGroup(
                mappingGroupName,
                triggers,
                dispatchEvent
            );

            Object.assign(props, propsForGroup);
        };

        const mapTrigger = (libraryName, eventName, eventProps) => {
            triggers.forEach((trigger) => {
                if (trigger.library === libraryName && trigger.event === eventName) {
                    Object.assign(props, eventProps);
                }
            });
        };

        mapTriggersToProps(mapTrigger, importTriggerMappings, dispatchEvent);

        return (
            <Component {...mapAttributesToProps(attributes)} {...mapUniqueIdToProps(uniqueId)} {...props}>
                {children}
            </Component>
        );
    };
};
