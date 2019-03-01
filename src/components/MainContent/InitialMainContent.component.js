/**
© Copyright 2017 the World Health Organization (WHO).

This software is distributed under the terms of the GNU General Public License version 3 (GPL Version 3), copied verbatim in the file “COPYING”.  In applying this license, WHO does not waive any of the privileges and immunities enjoyed by WHO under national or international law or submit to any national court jurisdiction.
*/

import React from 'react';
import PropTypes from 'proptypes';
import { Layer, Label, Text, Tag, Stage, Arrow } from 'react-konva';
import { viewModes } from '../../constants/configConstants';

const InitialMainContent = (props, context) => {
    const contents = {
        [viewModes.desktop]: () => {
            const textBrowseLeft = 'Browse indicators,\ndata elements or data sets,\nor search for metadata of all types';
            const textBrowseRight = 'Browse recommended\nWHO indicators with definitions';

            return (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Stage width={480} height={400}>
                        <Layer>
                            <Label x={0} y={100}>
                                <Tag fill={context.muiTheme.labelShapes.fill} lineJoin="round" pointerDirection="left" pointerWidth={100} pointerHeight={180} shadowColor={context.muiTheme.labelShapes.borderColor} shadowBlur={10} shadowOffset={10} shadowOpacity={0.5} />
                                <Text text={textBrowseLeft} fontSize={20} fill={context.muiTheme.labelShapes.textColor} padding={25} />
                            </Label>
                        </Layer>
                        <Layer>
                            <Label x={480} y={300}>
                                <Tag fill={context.muiTheme.labelShapes.fill} lineJoin="round" pointerDirection="right" pointerWidth={100} pointerHeight={135} shadowColor={context.muiTheme.labelShapes.borderColor} shadowBlur={10} shadowOffset={10} shadowOpacity={0.5} />
                                { false && // disabled for now
                                    <Text text={textBrowseRight} fontSize={20} fill={context.muiTheme.labelShapes.textColor} padding={25} />
                                }
                            </Label>
                        </Layer>
                    </Stage>
                </div>
            );
        },
        [viewModes.tablet]: () => {
            const textBrowseLeft = 'Browse indicators,\ndata elements or data sets,\nor search for metadata of all types';
            const textBrowseRight = 'Browse recommended\nWHO indicators with definitions';

            return (
                <div style={{}}>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Stage width={400} height={150}>
                            <Layer>
                                <Label x={0} y={30}>
                                    <Tag fill={context.muiTheme.labelShapes.fill} lineJoin="round" shadowColor={context.muiTheme.labelShapes.borderColor} shadowBlur={10} shadowOffset={10} shadowOpacity={0.5} />
                                    { false && // disabled for now
                                        <Text text={textBrowseRight} fontSize={20} fill={context.muiTheme.labelShapes.textColor} padding={25} /> 
                                    }
                                </Label>
                                <Arrow x={320} y={50} points={[0, 0, 70, -20]} pointerLength={15} pointerWidth={15} fill={context.muiTheme.labelShapes.fill} stroke={context.muiTheme.labelShapes.fill} strokeWidth={3} />
                            </Layer>
                        </Stage>
                    </div>

                    <div style={{}}>
                        <Stage width={480} height={200}>
                            <Layer>
                                <Label x={0} y={100}>
                                    <Tag fill={context.muiTheme.labelShapes.fill} lineJoin="round" pointerDirection="left" pointerWidth={100} pointerHeight={180} shadowColor={context.muiTheme.labelShapes.borderColor} shadowBlur={10} shadowOffset={10} shadowOpacity={0.5} />
                                    <Text text={textBrowseLeft} fontSize={20} fill={context.muiTheme.labelShapes.textColor} padding={25} />
                                </Label>
                            </Layer>
                        </Stage>
                    </div>
                </div>
            );
        },
        [viewModes.phone]: () => {
            const text = 'Click the menu icon\nto start browsing';

            return (
                <div style={{}}>
                    <Stage width={320} height={180}>
                        <Layer>
                            <Label x={0} y={70}>
                                <Tag fill={context.muiTheme.labelShapes.fill} lineJoin="round" shadowColor={context.muiTheme.labelShapes.borderColor} shadowBlur={10} shadowOffset={10} shadowOpacity={0.5} />
                                <Text text={text} fontSize={20} fill={context.muiTheme.labelShapes.textColor} padding={25} />
                            </Label>
                            <Arrow x={35} y={73} points={[0, 0, -25, -70]} pointerLength={15} pointerWidth={15} fill={context.muiTheme.labelShapes.fill} stroke={context.muiTheme.labelShapes.fill} strokeWidth={3} />
                        </Layer>
                    </Stage>
                </div>
            );
        },
    };

    return (
        <div>
            {contents[props.viewMode]()}
        </div>
    );
};

InitialMainContent.propTypes = {
    viewMode: PropTypes.number,
};
InitialMainContent.contextTypes = {
    muiTheme: PropTypes.object,
};

export default InitialMainContent;
