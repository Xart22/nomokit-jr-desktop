import ScratchBlocks from 'openblock-blocks';

const categorySeparator = '<sep gap="36"/>';

/* eslint-disable no-unused-vars */
const motion = function (isInitialSetup, isStage, targetId) {
    const stageSelected = ScratchBlocks.ScratchMsgs.translate(
        'MOTION_STAGE_SELECTED',
        'Stage selected: no motion blocks'
    );
    return `
    <category name="%{BKY_CATEGORY_MOTION}" id="motion" colour="#4C97FF" secondaryColour="#3373CC">
        ${isStage ? `
        <label text="${stageSelected}"></label>
        ` : `
        <block type="motion_moveright">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="motion_moveleft">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="motion_moveup">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="motion_movedown">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="motion_hop">
        <value name="STEPS">
            <shadow type="math_number">
                <field name="NUM">1</field>
            </shadow>
        </value>
        </block>
        <block type="motion_go_home"></block>
        <block type="motion_turnright">
            <value name="DEGREES">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="motion_turnleft">
            <value name="DEGREES">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>`
        }
        ${categorySeparator}
    </category>
    `;
};

const looks = function (isInitialSetup, isStage, targetId, costumeName, backdropName) {
    const hello = ScratchBlocks.ScratchMsgs.translate('LOOKS_HELLO', 'Hello!');
    return `
    <category name="%{BKY_CATEGORY_LOOKS}" id="looks" colour="#9966FF" secondaryColour="#774DCB">
        ${isStage ? '' : `
        <block type="looks_say">
            <value name="MESSAGE">
                <shadow type="text">
                    <field name="TEXT">${hello}</field>
                </shadow>
            </value>
        </block>`}
        ${categorySeparator}
    </category>
    `;
};

const events = function (isInitialSetup, isStage, targetId, isRealtimeMode) {
    return `
    <category name="%{BKY_CATEGORY_EVENTS}" id="events" colour="#FFD500" secondaryColour="#CC9900">
        ${isRealtimeMode ? `
        <block type="event_whenflagclicked"/>
        <block type="event_whenkeypressed">
            <value name="KEY_OPTION">
                <shadow type="event_menu_key">
                </shadow>
            </value>
        </block>
        ${isStage ? `
            <block type="event_whenstageclicked"/>
        ` : `
            <block type="event_whenthisspriteclicked"/>
        `}` : ''}
        ${categorySeparator}
    </category>
    `;
};

const control = function (isInitialSetup, isStage, targetId, isRealtimeMode) {
    return `
    <category name="%{BKY_CATEGORY_CONTROL}" id="control" colour="#FFAB19" secondaryColour="#CF8B17">
        ${isRealtimeMode ? `
        <block type="control_wait">
            <value name="DURATION">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="control_repeat">
            <value name="TIMES">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block type="control_forever"/>` : ''}
        ${categorySeparator}
    </category>
    `;
};

const operators = function (isInitialSetup, isStage, targetId, isRealtimeMode) {
    return `
    <category name="%{BKY_CATEGORY_OPERATORS}" id="operators" colour="#59C059" secondaryColour="#389438">
        <block type="operator_add">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="operator_equals">
            <value name="OPERAND1">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="OPERAND2">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        ${categorySeparator}
    </category>
    `;
};

const variables = function (isInitialSetup, isStage, targetId, isRealtimeMode) {
    return `
    <category name="%{BKY_CATEGORY_VARIABLES}" id="variables" colour="#FF8C1A" secondaryColour="#DB6E00"
        custom="VARIABLE">
    </category>
    `;
};

const myBlocks = function () {
    return `
    <category name="%{BKY_CATEGORY_MYBLOCKS}" id="myBlocks" colour="#FF6680" secondaryColour="#FF4D6A"
        custom="PROCEDURE">
    </category>
    `;
};

/* eslint-enable no-unused-vars */

const getXML = function (isInitialSetup, isStage, targetId, isRealtimeMode, costumeName, backdropName, soundName) {
    const gap = [categorySeparator];

    const motionXML = motion(isInitialSetup, isStage, targetId);
    const looksXML = looks(isInitialSetup, isStage, targetId, costumeName, backdropName);
    const eventsXML = events(isInitialSetup, isStage, targetId, isRealtimeMode);
    const controlXML = control(isInitialSetup, isStage, targetId, isRealtimeMode);
    const operatorsXML = operators(isInitialSetup, isStage, targetId, isRealtimeMode);
    const variablesXML = variables(isInitialSetup, isStage, targetId, isRealtimeMode);
    const myBlocksXML = myBlocks(isInitialSetup, isStage, targetId);

    return [
        motionXML, gap,
        looksXML, gap,
        eventsXML, gap,
        controlXML, gap,
        operatorsXML, gap,
        variablesXML, gap,
        myBlocksXML
    ];
};

export default getXML;
