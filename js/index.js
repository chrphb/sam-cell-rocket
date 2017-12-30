// Actions (Proposers) ------------------------------------------------------------
  let actions = {}

  actions.start = function(data, present) {
	  data.started = true ;
	  present(data) ;
	  return false ;
  }

  actions.launch = function(data, present) {
    data.launched = true ;
    present(data) ;
  }

  actions.abort = function(data, present) {
	  data.aborted = true ;
	  present(data) ;
	  return false ;
  }

  actions.decrement = function(data, present) {
    data = data || {} ;
    data.counter = data.counter || 10 ;
    var d = data ;
    var p = present ;
    setTimeout(function() {
      d.counter = d.counter - 1 ;
      p(d) ;
    }, 1000) ;
  }

// States (Learners) -----------------------------------------------------------------
  let states = {}

  states.ready = function (model) {
    return ((model.counter === COUNTER_MAX) && !model.started && !model.launched && !model.aborted);
  }
  states.counting = function (model) {
    return ((model.counter <= COUNTER_MAX) && (model.counter >= 0) && model.started && !model.launched && !model.aborted);
  }
  states.launched = function (model) {
    return ((model.counter === 0) && model.started && model.launched && !model.aborted);
  }
  states.aborted = function (model) {
    return ((model.counter <= COUNTER_MAX) && (model.counter >= 0) && model.started && !model.launched && model.aborted);
  }
// State-Views ------------------

  states.view = function(model) {
    if(states.ready(model)) return states.readyView(model)
    if(states.aborted(model)) return states.abortedView(model)
    if(states.launched(model)) return states.launchedView(model)
    if(states.counting(model)) return states.countingView(model)
    return states.readyView(model)
  }

  states.readyView = function(model) {
      var t = "Countdown: "
      if(model.counter) {
        t = t + model.counter
      }
      var comps = [
          { 
            $type: "div", 
            $components: [{ $type: "p", $text: t},
                          { $type: "button", 
                            $text: "Start",
                            onclick: function(e){
                              actions.start({},this._modelPresent)
                            }}
                            ]
          }
      ]
      return comps    
  }

  states.abortedView = function(model) {
      var t = "Aborted at Countdown: "
      if(model.counter) {
        t = t + model.counter
      }
      var comps = [
          { 
            $type: "div", 
            $components: [{ $type: "p",
                            $text: t}]
          }
      ]
      return comps    
  }

  states.countingView = function(model) {
      var t = "Countdown: "
      if(model.counter) {
        t = t + model.counter
      }
      var comps = [
          { 
            $type: "div", 
            $components: [{ $type: "p", $text: t},
                          { $type: "button", 
                            $text: "Abort",
                            onclick: function(e){
                              actions.abort({},this._modelPresent)
                            }}]
          }
      ]
      return comps      
  }

  states.launchedView = function(model) {
      var comps = [
          { 
            $type: "div", 
            $components: [{ $type: "img",
                              src: "img/launched.gif"}]
          }
      ]
      return comps      
  }

  states.nextAction = function(model, present) {
    if (states.counting(model)) {
      if (model.counter > 0) {
        actions.decrement({counter: model.counter},present)
      }
      if (model.counter === 0) {
        actions.launch({},present)
      }
    }
  }