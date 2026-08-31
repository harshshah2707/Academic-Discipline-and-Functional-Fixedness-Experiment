import React, { useState } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { StimulusSvg } from '../../config/svgStimuli';
import { Package, Plus, Trash2, Edit2, Save, RotateCcw, Image, MoveUp, MoveDown } from 'lucide-react';

export const ObjectConfigEditor = () => {
  const { experimentalObjects, updateObjects, addObject, deleteObject, resetToDefaults } = useConfig();

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    displayName: '',
    conventionalFunction: '',
    imageUrl: ''
  });

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newObjForm, setNewObjForm] = useState({
    name: '',
    displayName: '',
    conventionalFunction: '',
    imageUrl: ''
  });

  const startEdit = (obj) => {
    setEditingId(obj.id);
    setEditForm({
      name: obj.name,
      displayName: obj.displayName || obj.name,
      conventionalFunction: obj.conventionalFunction,
      imageUrl: obj.imageUrl || ''
    });
    setIsAddingNew(false);
  };

  const saveEdit = (id) => {
    const updated = experimentalObjects.map(o => {
      if (o.id === id) {
        return {
          ...o,
          name: editForm.name.toUpperCase().trim(),
          displayName: editForm.displayName.trim() || editForm.name,
          conventionalFunction: editForm.conventionalFunction.trim(),
          imageUrl: editForm.imageUrl.trim()
        };
      }
      return o;
    });
    updateObjects(updated);
    setEditingId(null);
  };

  const handleCreateNew = (e) => {
    e.preventDefault();
    if (!newObjForm.name.trim() || !newObjForm.conventionalFunction.trim()) return;

    addObject({
      id: `custom_obj_${Date.now()}`,
      name: newObjForm.name.toUpperCase().trim(),
      displayName: newObjForm.displayName.trim() || newObjForm.name,
      conventionalFunction: newObjForm.conventionalFunction.trim(),
      imageUrl: newObjForm.imageUrl.trim()
    });

    setNewObjForm({ name: '', displayName: '', conventionalFunction: '', imageUrl: '' });
    setIsAddingNew(false);
  };

  const moveOrder = (index, direction) => {
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= experimentalObjects.length) return;

    const list = [...experimentalObjects];
    const temp = list[index];
    list[index] = list[newIdx];
    list[newIdx] = temp;

    const reordered = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    updateObjects(reordered);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-slate-700" />
            <h3 className="font-bold text-slate-900 text-base">
              Experimental Stimuli & Objects Configuration
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure the objects presented during the experiment. Modify conventional function statements or add custom stimuli.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddingNew(true)}
            className="btn-primary text-xs py-1.5 px-3"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Object</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all experimental objects to standard 6 default objects?')) {
                resetToDefaults();
              }
            }}
            className="btn-secondary text-xs py-1.5 px-3"
            title="Reset to 6 standard default objects"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Add New Object Form */}
      {isAddingNew && (
        <form onSubmit={handleCreateNew} className="bg-slate-50 border border-slate-300 rounded-lg p-5 space-y-4 animate-fade-in">
          <h4 className="font-bold text-slate-900 text-sm">Add New Stimulus Object</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="new_obj_name" className="block text-xs font-medium text-slate-700 mb-1">
                Object Name (Uppercase) <span className="text-red-500">*</span>
              </label>
              <input
                id="new_obj_name"
                type="text"
                placeholder="e.g. HAMMER, KEY, SCISSORS"
                value={newObjForm.name}
                onChange={(e) => setNewObjForm(prev => ({ ...prev, name: e.target.value }))}
                className="form-input text-xs"
                required
              />
            </div>

            <div>
              <label htmlFor="new_image_url" className="block text-xs font-medium text-slate-700 mb-1">
                Image URL (Optional - leave blank for SVG icon)
              </label>
              <input
                id="new_image_url"
                type="url"
                placeholder="https://example.com/object.png"
                value={newObjForm.imageUrl}
                onChange={(e) => setNewObjForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                className="form-input text-xs"
              />
            </div>
          </div>

          <div>
            <label htmlFor="new_conv_func" className="block text-xs font-medium text-slate-700 mb-1">
              Conventional Function Statement <span className="text-red-500">*</span>
            </label>
            <input
              id="new_conv_func"
              type="text"
              placeholder="e.g. A hammer is commonly used to drive nails into wood."
              value={newObjForm.conventionalFunction}
              onChange={(e) => setNewObjForm(prev => ({ ...prev, conventionalFunction: e.target.value }))}
              className="form-input text-xs"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-xs py-1.5 px-3"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Object</span>
            </button>
          </div>
        </form>
      )}

      {/* Objects List */}
      <div className="space-y-3">
        {experimentalObjects.map((obj, idx) => {
          const isEditing = editingId === obj.id;

          return (
            <div
              key={obj.id}
              className="border border-slate-200 rounded-lg p-4 bg-white hover:border-slate-300 transition-colors"
            >
              {isEditing ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Object Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="form-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL</label>
                      <input
                        type="text"
                        value={editForm.imageUrl}
                        onChange={(e) => setEditForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                        className="form-input text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Conventional Function Statement</label>
                    <input
                      type="text"
                      value={editForm.conventionalFunction}
                      onChange={(e) => setEditForm(prev => ({ ...prev, conventionalFunction: e.target.value }))}
                      className="form-input text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="btn-secondary text-xs py-1 px-3"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => saveEdit(obj.id)}
                      className="btn-primary text-xs py-1 px-3"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded flex items-center justify-center p-1 shrink-0">
                      {obj.imageUrl ? (
                        <img src={obj.imageUrl} alt={obj.name} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <StimulusSvg name={obj.name} className="w-10 h-10" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{obj.name}</span>
                        <span className="text-[11px] font-mono text-slate-400">ID: {obj.id}</span>
                        <span className="text-[11px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                          Order: {idx + 1}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        "{obj.conventionalFunction}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 self-end sm:self-center">
                    <button
                      onClick={() => moveOrder(idx, -1)}
                      disabled={idx === 0}
                      className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded"
                      title="Move Up"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveOrder(idx, 1)}
                      disabled={idx === experimentalObjects.length - 1}
                      className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded"
                      title="Move Down"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => startEdit(obj)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 rounded"
                      title="Edit Object"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete stimulus ${obj.name}?`)) {
                          deleteObject(obj.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                      title="Delete Object"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
