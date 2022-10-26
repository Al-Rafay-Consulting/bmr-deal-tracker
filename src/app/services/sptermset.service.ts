import { Injectable } from '@angular/core';
//import { ParentTerm } from 'src/app/modules/settlement/parent-term.model';
import * as customConfig from 'src/app/customConfig.json';
//var customConfig = require('src/app/customConfig.json');
declare let SP: any;

@Injectable({
  providedIn: 'root'
})
export class SptermsetService {

  // E1 Server
  // TaxonomyCollectionName: string = "Taxonomy_AIwnQWRGAeLGjLP3NenxZg==";   //"Taxonomy_emiHFC2qzG0vaXZyRo69WQ==";
  // TaxonomyCollectionID: string = "e94d741650924715b42ba8465111ab2c"
  // SettlementFormGroupsTermSets: string = "566e717b-3f72-472e-8455-de372f28db85";
  // SettlementCategoryMasterTermSets: string = "1e7f74d4-2ffa-4493-8454-6cf2513cf11b";
  // SettlementReportGroupsTermSets: string = "c84046d4-d41c-4e65-939b-a036b6659c17";

  TaxonomyCollectionID: string = customConfig.termSet.TaxonomyCollectionID;
  SettlementFormGroupsTermSets: string = customConfig.termSet.SettlementFormGroupsTermSets;
  SettlementCategoryMasterTermSets: string = customConfig.termSet.SettlementCategoryMasterTermSets;
  SettlementReportGroupsTermSets: string = customConfig.termSet.SettlementReportGroupsTermSets;
  SettlementReportExpenseGroupsTermSets: string = customConfig.termSet.SettlementReportExpenseGroupsTermSets;

  // //E2 Server
  // TaxonomyCollectionName: string = "Taxonomy_emiHFC2qzG0vaXZyRo69WQ==";
  // SettlementFormGroupsTermSets: string = "b27aafe9-6d4c-438a-9319-114da8053909";
  // SettlementCategoryMasterTermSets: string = "40e44e0c-606d-48f5-8d3b-14c7ff20ff03";
  // SettlementReportGroupsTermSets: string = "b9f19624-9ca2-44e3-83b1-93997c2430dc";

  // // // //SDT Production
  // TaxonomyCollectionName: string = "Taxonomy_mxL3vsucpbjGX+enOOw6MQ==";
  // SettlementFormGroupsTermSets: string = "510a2bb1-df6d-41d0-a776-79ca949032e5";
  // SettlementCategoryMasterTermSets: string = "c15235b9-e33c-4534-b54f-58c7e295710d";
  // SettlementReportGroupsTermSets: string = "843fdc53-9802-4504-9cdd-d343d6b9a7a9";

  // // EMAP-DEMO
  // TaxonomyCollectionID: string = "e94d741650924715b42ba8465111ab2c"
  // SettlementFormGroupsTermSets: string = "5c4cb832-622b-49f3-bf1b-d73e0ec36fca";
  // SettlementCategoryMasterTermSets: string = "37cc9ecc-98a3-4fbe-9738-934ba47677b3";
  // SettlementReportGroupsTermSets: string = "a09f3d5d-8e41-43c4-aa5a-744116e5e000";

  constructor() { }

  //Get Settlement Category Master data from term set
  getSPSettlementCategoryMasterTermsSet() {
    let context = new SP.ClientContext("http://localhost:8080/");
    if (window.location.origin.indexOf("sharepoint.com") > 0)
      context = new SP.ClientContext.get_current();

    //let TermStoreName = this.TaxonomyCollectionName;
    let taxSession = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);
    let termStores = taxSession.get_termStores();
    //let termStore = termStores.getByName(TermStoreName);
    let termStore = termStores.getById(this.TaxonomyCollectionID);
    let termSet = termStore.getTermSet(this.SettlementCategoryMasterTermSets);
    let terms = termSet.getAllTerms();
    context.load(terms);

    return new Promise((resolve, reject) => {
      context.executeQueryAsync(() => {
        let termEnumerator = terms.getEnumerator();
        let SettlementCategoryData = [];
        while (termEnumerator.moveNext()) {
          let currentTerm = termEnumerator.get_current();
          let isDeprecated = currentTerm.get_isDeprecated();
          if (!isDeprecated) {
            SettlementCategoryData.push(
              {
                CategoryName: currentTerm.get_name(),
                CategoryValue: currentTerm.get_id()._m_guidString$p$0,
              });
          }
        }
        resolve(SettlementCategoryData);
      }, (error: any) => {
        console.log(error);
        reject();
      });
    });
  }





}

