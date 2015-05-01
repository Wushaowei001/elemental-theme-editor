import Ember from 'ember';

export default Ember.Component.extend({
  _themeJSON: null,
  _inspectActive: null,
  adapter: Ember.inject.service(),
  fontFamily: null,
  scale: null,
  color: null,
  surface: false,
  inspectActive: Ember.computed('_inspectActive', function() {
    if (this._inspectActive) { return 'inspect-active' }
  }),

  init: function() {
    this._super(...arguments);
    let adapter = this.get('adapter'); // instantiate this immediately
    Ember.$.getJSON('http://localhost:4200/theme').then(themeJSON => {
      this._themeJSON = themeJSON;
      this.setProperties(themeJSON.globals);
    });
  },

  didInsertElement() {
    var iconic = IconicJS();
    iconic.update();
  },

  actions: {
    reload() {
      window.location.reload();
    },

    save() {
      console.log('saving settings!');
      this._themeJSON.globals = this.getProperties('fontFamily', 'scale', 'color', 'surface');

      Ember.$.ajax('http://localhost:4200/theme', {
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(this._themeJSON)
      }).then(json => {
        this.get('adapter').callAction('reloadCSS', json.theme);
      }, xhr => {
        console.log('failure');
      });
    },

    inspect() {
      this.toggleProperty('_inspectActive');
      this.get('adapter').callAction('inspect');
    }
  }
});
