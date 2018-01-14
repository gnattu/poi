import React from 'react'
import { connect } from 'react-redux'
import { Label, ProgressBar } from 'react-bootstrap'
import { createSelector } from 'reselect'
import { getHpStyle, getTyku } from 'views/utils/game-utils'
import { LandbaseSlotitems } from './slotitems'
import { landbaseSelectorFactory, landbaseEquipDataSelectorFactory } from 'views/utils/selectors'

const { i18n } = window
const __ = i18n.main.__.bind(i18n.main)

export const SquardRow = connect((state, { squardId }) =>
  createSelector([
    landbaseSelectorFactory(squardId),
    landbaseEquipDataSelectorFactory(squardId),
  ], (landbase, equipsData) => ({
    landbase,
    equipsData,
    squardId,
  }))
)(({landbase, equipsData, squardId}) => {
  let { api_action_kind, api_distance, api_name, api_nowhp, api_maxhp } = landbase
  api_nowhp = api_nowhp || 200
  api_maxhp = api_maxhp || 200
  const tyku = getTyku([equipsData], api_action_kind)
  const hpPercentage = api_nowhp / api_maxhp * 100
  const statuslabel = (() => {
    switch (api_action_kind) {
    // 0=待機, 1=出撃, 2=防空, 3=退避, 4=休息
    case 0:
      return <Label bsStyle='default'>{__('Standby')}</Label>
    case 1:
      return <Label bsStyle='danger'>{__('Sortie')}</Label>
    case 2:
      return <Label bsStyle='warning'>{__('Defense')}</Label>
    case 3:
      return <Label bsStyle='primary'>{__('Retreat')}</Label>
    case 4:
      return <Label bsStyle='success'>{__('Rest')}</Label>
    }
  })()
  return (
    <div className="ship-item">
      <div className="ship-info ship-info-show">
        <span className="ship-name">
          {api_name}
        </span>
        <div className="ship-exp">
          <span className='ship-lv'>
            {__('Range')}: {api_distance}
          </span>
          <br />
          <span className="ship-lv">
            {__('Fighter Power')}: {(tyku.max === tyku.min) ? tyku.min : tyku.min + ' ~ ' + tyku.max}
          </span>
        </div>
      </div>
      <div className="ship-stat landbase-stat">
        <div className="div-row">
          <span className="ship-hp">
            {api_nowhp} / {api_maxhp}
          </span>
          <div className="lbac-status-label">
            {statuslabel}
          </div>
        </div>
        <span className="hp-progress top-space">
          <ProgressBar bsStyle={getHpStyle(hpPercentage)}
            now={hpPercentage} />
        </span>
      </div>
      <div className="ship-slot">
        <LandbaseSlotitems landbaseId={squardId} isMini={false} />
      </div>
    </div>
  )
})
