Screw.Unit(function(c) { with(c) {  
  describe("Screw.Example", function() {
    var example, name, fn, should_fail, parent_description, events, original_reset_mocks, example_contexts;

    before(function() {
      events = [];
      example_contexts = [];

      name = "example"
      should_fail = false;
      fn = function() {
        events.push("example function called");
        example_contexts.push(this);
        if (should_fail) throw(new Error("sad times"));
      };
      example = new Screw.Example(name, fn);
      parent_description = new Screw.Description("parent description")
      parent_description.run_befores = function(example_context) {
        events.push("run_befores called");
        example_contexts.push(example_context);
      }
      parent_description.run_afters = function(example_context) {
        events.push("run_afters called");
        example_contexts.push(example_context);
      }

      example.parent_description = parent_description;

      original_reset_mocks = Screw.reset_mocks;
      Screw.reset_mocks = function() {
        events.push("reset_mocks called");
      }
    });

    after(function() {
      Screw.reset_mocks = original_reset_mocks;
    });

    describe("#initialize", function() {
      it("assigns #name and #fn", function() {
        expect(example.name).to(equal, name);
        expect(example.fn).to(equal, fn);
      });
      
      it("sets #failed and #passed to false", function() {
        expect(example.passed).to(be_false);
        expect(example.failed).to(be_false);
      });
    });

    describe("#enqueue", function() {
      it("sets up #run to be called asynchronously via setTimeout", function() {
        var set_timeout_callback;
        mock(window, "setTimeout", function(callback, timeout) { set_timeout_callback = callback; });
        mock(example, "run");

        example.enqueue();
        expect(example.run).to_not(have_been_called);

        set_timeout_callback.call(window);
        expect(example.run).to(have_been_called);
      });
    });

    describe("#run", function() {
      it("with the same example context, calls parent_description.run_befores, invokes the example function, calls parent_description.run_afters, then calls Screw.reset_mocks", function() {
        example.run();
        expect(events).to(equal, ["run_befores called", "example function called", "run_afters called", "reset_mocks called"]);
        expect(example_contexts.length).to(equal, 3);
        expect(example_contexts[0]).to(equal, example_contexts[1]);
        expect(example_contexts[0]).to(equal, example_contexts[2]);
      });

      context("if the example is pending", function() {
        var pending_example;
        before(function() {
          pending_example = new Screw.Example(name, fn, true);
        })
        it("invokes callbacks registered with #on_pending", function() {
          var callback_invoked = false;
          pending_example.on_pending(function() {
            callback_invoked = true;
          })
          pending_example.run();
          expect(callback_invoked).to(be_true);
        });
      });
      
      context("if the example fails", function() {
        before(function() {
          should_fail = true;
        });
        
        it("invokes callbacks registered with #on_fail", function() {
          var callback_invoked = false;
          example.on_fail(function() {
            callback_invoked = true;
          })
          example.run();
          expect(callback_invoked).to(be_true);
        });

        it("assigns #failed to true and #passed to false", function() {
          expect(example.passed).to(be_false);
          expect(example.failed).to(be_false);
          example.run();
          expect(example.passed).to(be_false);
          expect(example.failed).to(be_true);
        });
      });

      context("if the example passes", function() {
        before(function() {
          expect(should_fail).to(be_false);
        });

        it("invokes callbacks registered with #on_pass", function() {
          var callback_invoked = false;
          example.on_pass(function() {
            callback_invoked = true;
          })
          example.run();
          expect(callback_invoked).to(be_true);
        });

        it("assigns #passed to true and #failed to false", function() {
          expect(example.passed).to(be_false);
          expect(example.failed).to(be_false);
          example.run();
          expect(example.passed).to(be_true);
          expect(example.failed).to(be_false);
        });
      });
    });

    describe("#total_examples", function() {
      it("always returns 1", function() {
        expect(example.total_examples()).to(equal, 1);
      });
    });

    describe("#path", function() {
      it("returns #index concatenated to the #path of the #parent_description", function() {
        expect(example.path()).to(equal, parent_description.path() + [example.index]);
      });
    });
  });
}});