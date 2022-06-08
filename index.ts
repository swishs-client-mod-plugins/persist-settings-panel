/* The source code below is licensed under MIT */

import Plugin from '@structures/plugin';

import { create } from '@patcher';
import { getByProps } from '@webpack';
import { Layers } from '@webpack/common';
import { getOwnerInstance, waitFor } from '@utilities';

const Patcher = create('persist-settings-panel');

const classes = getByProps('godlike');

interface AccountContainer {
  forceUpdate: () => void;
  renderSettingsGear: () => {
    props: {
      onClick: () => void;
    };
  };
}

export default class PersistSettingsPanel extends Plugin {
  status = { firstOpen: true };

  async start() {
    const element = await waitFor(`.${classes.container}`, 60000);
    if (!element || !this.started) return;

    const AccountContainer: AccountContainer = getOwnerInstance(element);
    if (!AccountContainer) return;

    Patcher.after(AccountContainer, 'renderSettingsGear', (_, __, ret) => {
      ret.props.onClick = (orignal => () => {
        if (this.status.firstOpen) {
          this.status.firstOpen = false;
          return orignal();
        }

        Layers.pushLayer('USER_SETTINGS');
      })(ret.props.onClick);
    });

    AccountContainer.forceUpdate?.();
  }

  stop() {
    Patcher.unpatchAll();
  }
};
