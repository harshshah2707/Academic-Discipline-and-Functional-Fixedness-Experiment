import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_EXPERIMENTAL_OBJECTS, PRACTICE_OBJECT } from '../config/defaultObjects';
import { DEFAULT_EXPERIMENT_SETTINGS } from '../config/defaultSettings';
import { storageService } from '../services/storageService';

const ConfigContext = createContext(null);

export const ConfigProvider = ({ children }) => {
  const [experimentalObjects, setExperimentalObjects] = useState(() => {
    const saved = storageService.getObjectsConfig();
    return saved && saved.length > 0 ? saved : DEFAULT_EXPERIMENTAL_OBJECTS;
  });

  const [practiceObject, setPracticeObject] = useState(PRACTICE_OBJECT);

  const [settings, setSettings] = useState(() => {
    const saved = storageService.getSettingsConfig();
    return saved ? { ...DEFAULT_EXPERIMENT_SETTINGS, ...saved } : DEFAULT_EXPERIMENT_SETTINGS;
  });

  // Persist objects changes
  useEffect(() => {
    storageService.saveObjectsConfig(experimentalObjects);
  }, [experimentalObjects]);

  // Persist settings changes
  useEffect(() => {
    storageService.saveSettingsConfig(settings);
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateObjects = (newObjects) => {
    setExperimentalObjects(newObjects);
  };

  const addObject = (newObj) => {
    setExperimentalObjects(prev => [
      ...prev,
      {
        ...newObj,
        id: newObj.id || `obj_${Date.now()}`,
        order: prev.length + 1
      }
    ]);
  };

  const deleteObject = (objId) => {
    setExperimentalObjects(prev => {
      const filtered = prev.filter(o => o.id !== objId);
      return filtered.map((o, idx) => ({ ...o, order: idx + 1 }));
    });
  };

  const resetToDefaults = () => {
    setExperimentalObjects(DEFAULT_EXPERIMENTAL_OBJECTS);
    setSettings(DEFAULT_EXPERIMENT_SETTINGS);
    setPracticeObject(PRACTICE_OBJECT);
    storageService.saveObjectsConfig(DEFAULT_EXPERIMENTAL_OBJECTS);
    storageService.saveSettingsConfig(DEFAULT_EXPERIMENT_SETTINGS);
  };

  return (
    <ConfigContext.Provider
      value={{
        experimentalObjects,
        practiceObject,
        settings,
        updateSettings,
        updateObjects,
        addObject,
        deleteObject,
        resetToDefaults
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
