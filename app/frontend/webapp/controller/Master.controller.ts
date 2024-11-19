import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import StandardListItem from "sap/m/StandardListItem";
import Event from "sap/ui/base/Event";
import UIComponent from "sap/ui/core/UIComponent";
import formatter from "../model/formatter";

/**
 * @namespace flexso.htf.frontend.frontend.controller
 */
export default class Master extends Controller {
  public formatter = formatter;

  public onInit(): void {
    const oComponent = this.getOwnerComponent();
    if (oComponent) {
      const oModel = oComponent.getModel() as ODataModel;
      if (oModel) {
        const oBinding = oModel.bindList("/KnownGalaxies");
        oBinding.requestContexts().then((aContexts) => {
          const aData = aContexts.map((oContext) => oContext.getObject());
          const oJSONModel = new JSONModel({ value: aData });
          this.getView()?.setModel(oJSONModel, "galaxies");
        }).catch((oError) => {
          console.error("Error fetching data", oError);
        });
      }
    }
  }

  public onListItemPress(oEvent: Event): void {
    const oItem = oEvent.getSource() as StandardListItem;
    const sGalaxyId = oItem.data("GalaxyId");
    if (sGalaxyId) {
      const oRouter = (this.getOwnerComponent() as UIComponent).getRouter();
      oRouter.navTo("Detail", {
        GalaxyId: sGalaxyId,
        layout: "TwoColumnsMidExpanded"
      });
    } else {
      console.error("GalaxyId is undefined");
    }
  }
}