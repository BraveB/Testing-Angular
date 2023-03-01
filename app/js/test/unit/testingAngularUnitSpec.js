describe("Testing Angular Test Suite", function () {
  describe("testing angular controller", function () {
    it("should initialize the title in the scope", function () {
      module("testingAngularApp");
      let scope = {};
      let ctrl;
      inject(function ($controller) {
        ctrl = $controller("testingAngularController", { $scope: scope });
      });
      expect(scope.title).toBeDefined();
      expect(scope.title).toBe("testing angularjs application");
    });
  });
});
