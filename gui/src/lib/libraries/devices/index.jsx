import React from "react";
import { FormattedMessage } from "react-intl";
import { defaults } from "lodash";
import log from "../../log";
import { DeviceType } from "../../device";

import arduinoBaseToolBox from "./baseToolbox/arduino";
import microbitBaseToolBox from "./baseToolbox/microbit";
import wedo2BaseToolBox from "./baseToolbox/wedo2";

import unselectDeviceIconURL from "./unselectDevice/unselectDevice.png";

import arduinoUnoIconURL from "./arduinoUno/arduinoUno.png";
import arduinoUnoConnectionIconURLL from "./arduinoUno/arduinoUno-illustration.svg";
import arduinoUnoConnectionSmallIconURL from "./arduinoUno/arduinoUno-small.svg";

import arduinoNanoIconURL from "./arduinoNano/arduinoNano.png";
import arduinoNanoConnectionIconURLL from "./arduinoNano/arduinoNano-illustration.svg";
import arduinoNanoConnectionSmallIconURL from "./arduinoNano/arduinoNano-small.svg";

import arduinoLeonardoIconURL from "./arduinoLeonardo/arduinoLeonardo.png";
import arduinoLeonardoConnectionIconURLL from "./arduinoLeonardo/arduinoLeonardo-illustration.svg";
import arduinoLeonardoConnectionSmallIconURL from "./arduinoLeonardo/arduinoLeonardo-small.svg";

import arduinoMega2560IconURL from "./arduinoMega2560/arduinoMega2560.png";
import arduinoMega2560ConnectionIconURLL from "./arduinoMega2560/arduinoMega2560-illustration.svg";
import arduinoMega2560ConnectionSmallIconURL from "./arduinoMega2560/arduinoMega2560-small.svg";

import microbitIconURL from "./microbit/microbit.png";
import microbitConnectionIconURLL from "./microbit/microbit-illustration.svg";
import microbitConnectionSmallIconURL from "./microbit/microbit-small.svg";

import microbitV2IconURL from "./microbitV2/microbitV2.png";
import microbitV2ConnectionIconURLL from "./microbitV2/microbitV2-illustration.svg";
import microbitV2ConnectionSmallIconURL from "./microbitV2/microbitV2-small.svg";

import esp32IconURL from "./esp32/esp32.png";
import esp32ConnectionIconURLL from "./esp32/esp32-illustration.svg";
import esp32ConnectionSmallIconURL from "./esp32/esp32-small.svg";

import esp8266NodeMCUIconURL from "./esp8266NodeMCU/esp8266NodeMCU.png";
import esp8266NodeMCUConnectionIconURL from "./esp8266NodeMCU/esp8266NodeMCU-illustration.svg";
import esp8266NodeMCUConnectionSmallIconURL from "./esp8266NodeMCU/esp8266NodeMCU-small.svg";

import k210MaixDockIconURL from "./k210MaixDock/k210MaixDock.png";
import k210MaixDockConnectionIconURLL from "./k210MaixDock/k210MaixDock-illustration.svg";
import k210MaixDockConnectionSmallIconURL from "./k210MaixDock/k210MaixDock-small.svg";

import k210MaixduinoIconURL from "./k210Maixduino/k210Maixduino.png";
import k210MaixduinoConnectionIconURLL from "./k210Maixduino/k210Maixduino-illustration.svg";
import k210MaixduinoConnectionSmallIconURL from "./k210Maixduino/k210Maixduino-small.svg";

import raspberryPiPicoIconURL from "./raspberryPiPico/raspberryPiPico.png";
import raspberryPiPicoConnectionIconURL from "./raspberryPiPico/raspberryPiPico-illustration.svg";
import raspberryPiPicoConnectionSmallIconURL from "./raspberryPiPico/raspberryPiPico-small.svg";

import makeymakeyIconURL from "./makeymakey/makeymakey.png";
import makeymakeyConnectionIconURL from "./makeymakey/makeymakey-illustration.svg";
import makeymakeyConnectionSmallIconURL from "./makeymakey/makeymakey-small.svg";

import wedo2IconURL from "../extensions/wedo2/wedo.png";
import wedo2ConnectionIconURL from "../extensions/wedo2/wedo-illustration.svg";
import wedo2ConnectionSmallIconURL from "../extensions/wedo2/wedo-small.svg";
import wedo2ConnectionTipIconURL from "../extensions/wedo2/wedo-button-illustration.svg";

const deviceData = [
    /**
     * Unselect the deivce back to pure scratch mode
     */
    {
        name: (
            <FormattedMessage
                defaultMessage="Unselect device"
                description="Name for the unselect device"
                id="gui.device.unselectDevice.name"
            />
        ),
        deviceId: "null",
        iconURL: unselectDeviceIconURL,
        description: (
            <FormattedMessage
                defaultMessage="Unselect the device, return to pure realtime programming mode."
                description="Description for the unselect device"
                id="gui.device.unselectDevice.description"
            />
        ),
        featured: true,
        hide: false,
        programMode: ["realtime"],
        programLanguage: ["block"],
        tags: ["realtime"],
    },
    {
        name: "Arduino Uno",
        deviceId: "arduinoUno",
        manufactor: "arduino.cc",
        learnMore: "https://store.arduino.cc/usa/arduino-uno-rev3",
        type: DeviceType.arduino,
        iconURL: arduinoUnoIconURL,
        description: (
            <FormattedMessage
                defaultMessage="A great board to get started with electronics and coding."
                description="Description for the Arduino Uno device"
                id="gui.device.arduinoUno.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        serialportRequired: true,
        defaultBaudRate: "9600",
        internetConnectionRequired: false,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: arduinoUnoConnectionIconURLL,
        connectionSmallIconURL: arduinoUnoConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their device."
                id="gui.device.arduinoUno.connectingMessage"
            />
        ),
        baseToolBoxXml: arduinoBaseToolBox,
        programMode: ["realtime", "upload"],
        programLanguage: ["block", "c", "cpp"],
        tags: ["arduino"],
        helpLink: "https://store.arduino.cc/usa/arduino-uno-rev3",
    },
    {
        name: "Arduino Nano",
        deviceId: "arduinoNano",
        manufactor: "arduino.cc",
        learnMore: "https://store.arduino.cc/usa/arduino-nano",
        type: DeviceType.arduino,
        iconURL: arduinoNanoIconURL,
        description: (
            <FormattedMessage
                defaultMessage="The Arduino Nano is a classic small board to build your projects with."
                description="Description for the Arduino Nano device"
                id="gui.device.arduinoNano.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        serialportRequired: true,
        defaultBaudRate: "9600",
        internetConnectionRequired: false,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: arduinoNanoConnectionIconURLL,
        connectionSmallIconURL: arduinoNanoConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their device."
                id="gui.device.arduinoNano.connectingMessage"
            />
        ),
        baseToolBoxXml: arduinoBaseToolBox,
        programMode: ["realtime", "upload"],
        programLanguage: ["block", "c", "cpp"],
        tags: ["arduino"],
        helpLink: "https://store.arduino.cc/usa/arduino-nano",
    },

    {
        name: "ESP32",
        deviceId: "arduinoEsp32",
        manufactor: "espressif",
        learnMore: "https://www.espressif.com/",
        type: DeviceType.arduino,
        iconURL: esp32IconURL,
        description: (
            <FormattedMessage
                defaultMessage="Wi-Fi & Bluetooth control board with rich functions."
                description="Description for the esp32 device"
                id="gui.device.esp32.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: false,
        serialportRequired: true,
        defaultBaudRate: "115200",
        internetConnectionRequired: false,
        launchPeripheralConnectionFlow: true,
        useAutoScan: false,
        connectionIconURL: esp32ConnectionIconURLL,
        connectionSmallIconURL: esp32ConnectionSmallIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their esp32."
                id="gui.device.esp32.connectingMessage"
            />
        ),
        baseToolBoxXml: arduinoBaseToolBox,
        programMode: ["upload", "realtime"],
        programLanguage: ["block", "c", "cpp"],
        tags: ["arduino"],
        helpLink:
            "https://docs.espressif.com/projects/esp-idf/zh_CN/latest/esp32/hw-reference/esp32/get-started-devkitc.html",
    },
    {
        name: "LEGO Education WeDo 2.0",
        deviceId: "wedo2",
        manufactor: "LEGO",
        learnMore: "https://scratch.mit.edu/wedo",
        type: null,
        iconURL: wedo2IconURL,
        description: (
            <FormattedMessage
                defaultMessage="Build with motors and sensors."
                description="Description for the 'LEGO WeDo 2.0' device"
                id="gui.device.wedo2.description"
            />
        ),
        featured: true,
        disabled: false,
        bluetoothRequired: true,
        serialportRequired: false,
        internetConnectionRequired: true,
        launchPeripheralConnectionFlow: true,
        useAutoScan: true,
        connectionIconURL: wedo2ConnectionIconURL,
        connectionSmallIconURL: wedo2ConnectionSmallIconURL,
        connectionTipIconURL: wedo2ConnectionTipIconURL,
        connectingMessage: (
            <FormattedMessage
                defaultMessage="Connecting"
                description="Message to help people connect to their WeDo."
                id="gui.device.wedo2.connectingMessage"
            />
        ),
        baseToolBoxXml: wedo2BaseToolBox,
        programMode: ["realtime"],
        programLanguage: ["block"],
        tags: ["kit"],
        helpLink: "https://scratch.mit.edu/wedo",
    },
];

/**
 * To get real device id. eg: the third party id like ironKit_arduinoUno.
 * @param {string} deviceId - the id of the device.
 * @return {string} deviceId - the real device id.
 */
const analysisRealDeviceId = (deviceId) => {
    if (deviceId) {
        // if the id contain '_' use the string afer the '_'.
        if (deviceId.indexOf("_") !== -1) {
            deviceId = deviceId.split("_")[1];
        }
    }
    return deviceId;
};

/**
 * Make device data from the input data. If it is a buid-in device, return the buid-in
 * data. If it is a third party device, find it's parent device, and overwrite its attributes
 * with the input data.
 * @param {string} deviceList - the list of devices.
 * @return {string} fullData - processed data of devices.
 */
const makeDeviceLibrary = (deviceList = null) => {
    let regeneratedDeviceData = [];

    if (deviceList) {
        deviceList.forEach((dev) => {
            // Because the micropython framework is not included in the community version,
            // for a control board that supports multiple programming frameworks, if it
            // also supports arduino, then we only load the arduino version of the device.
            if (
                typeof dev.typeList !== "undefined" &&
                dev.deviceId.indexOf("arduino") !== -1
            ) {
                dev.hide = false;
            }

            // Check if this is a build-in device.
            const matchedDevice = deviceData.find(
                (item) => dev.deviceId === item.deviceId
            );
            if (matchedDevice) {
                return regeneratedDeviceData.push(matchedDevice);
            }

            // This is a third party device. Try to parse it's parent deivce.
            const realDeviceId = analysisRealDeviceId(dev.deviceId);
            if (realDeviceId) {
                const parentDevice = deviceData.find(
                    (item) => realDeviceId === item.deviceId
                );
                if (parentDevice) {
                    return regeneratedDeviceData.push(
                        defaults({}, dev, { hide: false }, parentDevice)
                    );
                }
            }
            log.warn(
                "Cannot find this device or it's parent device :",
                dev.deviceId
            );
            return null;
        });

        regeneratedDeviceData.unshift(deviceData[0]); // add unselect deive in the head.

        // WeDo 2.0 lives in the built-in list but is absent from the local
        // server device list. Append it explicitly so it still appears.
        if (!regeneratedDeviceData.some(item => item.deviceId === 'wedo2')) {
            const wedo2 = deviceData.find(item => item.deviceId === 'wedo2');
            if (wedo2) regeneratedDeviceData.push(wedo2);
        }
    } else {
        regeneratedDeviceData = deviceData;
    }

    return regeneratedDeviceData;
};

export { deviceData as default, makeDeviceLibrary };
