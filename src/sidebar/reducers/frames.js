'use strict';

var util = require('./util');

function init() {
  return {
    // The list of frames connected to the sidebar app
    frames: [],
  };
}

var update = {
  ADD_FRAME_ANNOTATIONS: function (state, action) {
    var annotationsByUri = {};

    var frames = state.frames.map(function (frame) {
      var uri = frame.uri;

      var annotations = action.annotations.filter(function(annotation) {
        return annotation.uri === uri;
      });

      frame.annotations = annotations;
      return frame;
    });

    return {frames: frames};
  },

  CONNECT_FRAME: function (state, action) {
    return {frames: state.frames.concat(action.frame)};
  },

  DESTROY_FRAME: function (state, action) {
    var index = state.frames.indexOf(action.frame);
    if (index >= 0) {
      state.frames.splice(index, 1);
    }
    return {frames: state.frames};
  },

  UPDATE_FRAME_ANNOTATION_FETCH_STATUS: function (state, action) {
    var frames = state.frames.map(function (frame) {
      var match = (frame.uri && frame.uri === action.uri);
      if (match) {
        return Object.assign({}, frame, {
          isAnnotationFetchComplete: action.isAnnotationFetchComplete,
        });
      } else {
        return frame;
      }
    });
    return {
      frames: frames,
    };
  },
};

var actions = util.actionTypes(update);

/**
 * Add the annotations to their respective frames
 */
function addFrameAnnotations(annotations) {
  return {type: actions.ADD_FRAME_ANNOTATIONS, annotations: annotations};
}

/**
 * Add a frame to the list of frames currently connected to the sidebar app.
 */
function connectFrame(frame) {
  return {type: actions.CONNECT_FRAME, frame: frame};
}

/**
 * Remove a frame from the list of frames currently connected to the sidebar app.
 */
function destroyFrame(frame) {
  return {type: actions.DESTROY_FRAME, frame: frame};
}

/**
 * Update the `isAnnotationFetchComplete` flag of the frame.
 */
function updateFrameAnnotationFetchStatus(uri, status) {
  return {
    type: actions.UPDATE_FRAME_ANNOTATION_FETCH_STATUS,
    isAnnotationFetchComplete: status,
    uri: uri,
  };
}

/**
 * Return the list of frames currently connected to the sidebar app.
 */
function frames(state) {
  return state.frames;
}

module.exports = {
  init: init,
  update: update,

  actions: {
    addFrameAnnotations: addFrameAnnotations,
    connectFrame: connectFrame,
    destroyFrame: destroyFrame,
    updateFrameAnnotationFetchStatus: updateFrameAnnotationFetchStatus,
  },

  // Selectors
  frames: frames,
};
