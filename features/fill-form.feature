
# all tags at top of file are processed by a before hook in common-hooks.ts
@recordRequests

Feature: Fill Form

    Background: Open Form Component
        Given I navigate to "https://reactstrap.github.io"
        And I open the "Components" page
        And I select the "Form" component

    # tag the scenario with @live to run the browser in headfull mode
    #   and keep browser opened when test finishes

    # all tags used at the scenario level are used either to :
    #   - filter tests to run on CI
    #   - change the execution behavior of the scenario (@live or @debug or @ignore)
    #   - run a dedicated before/after hook in the steps definition file
    @foo
    Scenario: Submit a Form
        Given I input "foo.bar@baz.com" in field "Email"
        And I input "don't tel !!" in field "Password"
        And I select "3" in field "Select"
        And I select "1,3,5" in field "Select Multiple"
        And I input "bla bla bla" in field "Text Area"
        And I select radio button "Option two"
        And I check option "Check me out"
        When I submit the form
        Then the form should be submitted with "email" = "foo.bar@baz.com" in the Query String
