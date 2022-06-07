/* The source code below is licensed under MIT */

import Plugin from '@structures/plugin';

import { create } from '@patcher';
import { getByProps } from '@webpack';
import { Layers } from '@webpack/common';
import { getOwnerInstance } from '@utilities';

const Patcher = create('persist-settings-panel');

const classes = getByProps('godlike');

interface AccountContainer {
  renderSettingsGear: () => {
    props: {
      onClick: () => void;
    };
  };
}

export default class PersistSettingsPanel extends Plugin {
  start() {
    const accountContainer = getOwnerInstance(document.getElementsByClassName(classes.container)[0]);
    Patcher.after(accountContainer as any as AccountContainer, 'renderSettingsGear', (_, __, ret) => {
      ret.props.onClick = () => void Layers.pushLayer('USER_SETTINGS');
    });
  }

  stop() {
    Patcher.unpatchAll();
  }
}
