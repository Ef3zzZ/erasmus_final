import React, { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import type { CityData, SimulationStep, ClimateAnomalyType } from '../types';
import { Check, ChevronDown, Bot } from 'lucide-react';
import { playUiSound } from '../utils/audio';
import { springDefault, springSheet, springSnappy } from '../utils/motion';
import { CLIMATE_ANOMALY_CONFIG } from '../utils/climateAnomaly';
import { useLanguage } from '../context/LanguageContext';

interface ClimaAssistantProps {
  city: CityData;
  simulationStep: SimulationStep;
  activeAnomaly?: ClimateAnomalyType;
}

export const ClimaAssistant: React.FC<ClimaAssistantProps> = ({
  city,
  simulationStep,
  activeAnomaly = 'normal',
}) => {
  const { t, getAnomalyActions, getCitySummary, getSimulationStepLabel } = useLanguage();
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);

  const anomalyConfig = CLIMATE_ANOMALY_CONFIG[activeAnomaly];
  const anomalyDetail = city.classicalProfile?.anomalyDetails?.[activeAnomaly];
  const tone = anomalyConfig.color;
  const isCritical = activeAnomaly === 'severe' || simulationStep.tempDelta >= 2.0;

  const currentActionList = getAnomalyActions(activeAnomaly);
  const total = currentActionList.length;
  const done = completedActions.filter((a) => currentActionList.includes(a)).length;

  const stepInfo = getSimulationStepLabel(simulationStep);
  const citySummary = getCitySummary(city);

  const toggleAction = (action: string) => {
    const isDone = completedActions.includes(action);
    setCompletedActions((prev) => (isDone ? prev.filter((a) => a !== action) : [...prev, action]));
    if (!isDone) playUiSound('success');
  };

  return (
    <LayoutGroup id="clima">
      <AnimatePresence mode="popLayout" initial={false}>
        {!isMinimized ? (
          <motion.section
            key="clima-full"
            layoutId="clima-surface"
            transition={springDefault}
            className="inset rounded-[var(--r-m)] overflow-hidden"
            aria-label={t('climaAssistant')}
          >
            <div className="px-4 pt-3.5 pb-2 flex items-center gap-3">
              <button
                onClick={() => playUiSound('clima')}
                className="pressable w-8 h-8 rounded-[var(--r-s)] grid place-items-center shrink-0 row-hover"
                style={{ color: 'var(--accent)' }}
                aria-label={t('climaGuide')}
                title={t('climaGuide')}
              >
                <Bot className="w-[1.125rem] h-[1.125rem]" />
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="t-headline label-1">{t('climaGuide')}</h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 tracking-wide">
                    AI
                  </span>
                </div>
                <p className="t-caption label-3 truncate">
                  {stepInfo.label} {t('climaActionPlanFor')}
                </p>
              </div>

              <button
                onClick={() => setIsMinimized(true)}
                className="pressable btn btn-ghost btn-icon !w-8 !h-8"
                aria-label={t('minimizeAssistant')}
                title={t('minimizeAssistant')}
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div className="px-4 pb-3">
              <p className="t-body label-1">{citySummary}</p>

              {anomalyDetail && (
                <p className="t-caption label-2 mt-2">
                  <span className="font-semibold" style={{ color: tone }}>
                    {anomalyDetail.title}.
                  </span>{' '}
                  {anomalyDetail.description}
                </p>
              )}

              <AnimatePresence initial={false}>
                {simulationStep.tempDelta > 0 && (
                  <motion.p
                    key={simulationStep.label}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={springDefault}
                    className="t-caption label-2 overflow-hidden"
                  >
                    <span className="block pt-2">
                      {stepInfo.climaNote} (+{simulationStep.tempDelta}°C)
                    </span>
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="hairline-t px-4 pt-3 pb-2">
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="t-callout label-1 font-semibold">{t('recommendedActions')}</h4>
                <span className="t-caption label-3 tabular">
                  {done} / {total}
                </span>
              </div>

              <div className="h-[3px] rounded-full overflow-hidden mb-1" style={{ background: 'var(--surface-3)' }}>
                <motion.div
                  className="h-full w-full origin-left rounded-full"
                  style={{ background: 'var(--accent)' }}
                  initial={false}
                  animate={{ scaleX: total ? done / total : 0 }}
                  transition={springSheet}
                />
              </div>

              <ul>
                {currentActionList.map((action, idx) => {
                  const isDone = completedActions.includes(action);
                  return (
                    <li key={idx}>
                      <button
                        onClick={() => toggleAction(action)}
                        className={`pressable w-full text-left py-2.5 t-callout flex items-start gap-3 ${
                          isDone ? 'label-3' : 'label-1'
                        }`}
                        aria-pressed={isDone}
                      >
                        <span
                          className="relative w-[1.125rem] h-[1.125rem] rounded-[5px] grid place-items-center shrink-0 mt-px transition-colors duration-150"
                          style={
                            isDone
                              ? { background: 'var(--accent)' }
                              : { boxShadow: 'inset 0 0 0 1.5px var(--line-strong)' }
                          }
                        >
                          <AnimatePresence>
                            {isDone && (
                              <motion.span
                                initial={{ scale: 0.7, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={springSnappy}
                              >
                                <Check className="w-3 h-3" strokeWidth={3} style={{ color: 'var(--on-accent)' }} />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </span>
                        <span className={`flex-1 ${isDone ? 'line-through decoration-[var(--line-strong)]' : ''}`}>
                          {action}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.section>
        ) : (
          <motion.button
            key="clima-mini"
            layoutId="clima-surface"
            transition={springDefault}
            onClick={() => setIsMinimized(false)}
            className="pressable btn btn-secondary !h-10 !px-3.5"
          >
            <Bot className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            {t('openClimaGuide')}
            {isCritical && <span className="status-dot" style={{ color: 'var(--danger)' }} aria-label={t('criticalThreshold')} />}
          </motion.button>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
};
