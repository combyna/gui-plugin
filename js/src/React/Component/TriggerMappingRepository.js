/**
 * Combyna base GUI plugin
 * Copyright (c) the Combyna project and contributors
 * https://github.com/combyna/gui-plugin
 *
 * Released under the MIT license
 * https://github.com/combyna/gui-plugin/raw/master/MIT-LICENSE.txt
 */

export default class TriggerMappingRepository {
    constructor () {
        /**
         * Groups of library trigger mappings
         *
         * @type {Object.<string,{}>}
         */
        this.groups = {};
    }

    /**
     * Adds a mapping to a new or existing group
     *
     * @param {string} groupName
     * @param {string} libraryName
     * @param {string} eventName
     * @param {function} mappingFunction
     */
    addMapping (
        groupName,
        libraryName,
        eventName,
        mappingFunction
    ) {
        if (!Object.prototype.hasOwnProperty.call(this.groups, groupName)) {
            this.groups[groupName] = {};
        }

        if (!Object.prototype.hasOwnProperty.call(this.groups[groupName], libraryName)) {
            this.groups[groupName][libraryName] = {};
        }

        if (!Object.prototype.hasOwnProperty.call(this.groups[groupName][libraryName], eventName)) {
            this.groups[groupName][libraryName][eventName] = [];
        }

        this.groups[groupName][libraryName][eventName].push({ mappingFunction });
    }

    /**
     * @param {string} groupName
     * @param {object[]} triggers
     * @param {Function} dispatchEvent
     * @return {object}
     */
    getPropsForGroup(groupName, triggers, dispatchEvent) {
        if (!Object.prototype.hasOwnProperty.call(this.groups, groupName)) {
            return {};
        }

        return Object.keys(this.groups[groupName]).reduce((props, libraryName) => {
            Object.keys(this.groups[groupName][libraryName]).forEach((eventName) => {
                triggers.forEach((trigger) => {
                    if (trigger.library === libraryName && trigger.event === eventName) {
                        this.groups[groupName][libraryName][eventName].forEach(({ mappingFunction }) => {
                            Object.assign(props, mappingFunction(dispatchEvent));
                        });
                    }
                });
            });

            return props;
        }, {});
    }
}
