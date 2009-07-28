module("Screw", function(c) { with (c) {
  constructor("Example", function() {
    include(Screw.RunnableMethods);

    def('initialize', function(name, fn, pending) {
      this.name = name;
      this.fn = fn;
      this.fail_subscription_node = new Screw.SubscriptionNode();
      this.pass_subscription_node = new Screw.SubscriptionNode();
      this.pending_subscription_node = new Screw.SubscriptionNode();
      this.example_completed_subscription_node = new Screw.SubscriptionNode();
      this.passed = false;
      this.failed = false;
      this.pending = !!pending;
    });

    def('enqueue', function() {
      var self = this;
      setTimeout(function() { self.run(); }, 0);
    });

    def('run', function() {
      if (this.pending) {
        this.pending_subscription_node.publish()
        this.example_completed_subscription_node.publish(this);
      } else {
        try {
          try {
            var example_context = {};
            this.parent_description.run_befores(example_context);
            this.fn.call(example_context);
          } finally {
            this.parent_description.run_afters(example_context);
            Screw.reset_mocks();
          }
          this.passed = true;
          this.pass_subscription_node.publish();
          this.example_completed_subscription_node.publish(this);
        } catch(e) {
          this.failed = true;
          this.fail_subscription_node.publish(e);
          this.example_completed_subscription_node.publish(this);
        }        
      }
    });

    def('on_fail', function(callback) {
      this.fail_subscription_node.subscribe(callback);
    });

    def('on_pass', function(callback) {
      this.pass_subscription_node.subscribe(callback);
    });
    
    def('on_pending', function(callback) {
      this.pending_subscription_node.subscribe(callback);
    })

    def('total_examples', function() {
      return 1;
    });
  });
}});