
export class InvestmentSummary {
    ID:number=0;
    DealId:number = null;
    FundsId:any = null;
    AnalysisStartDate:string =null;
    EstCompletionDate:string=null;
    InPlaceRSF:number=null;
    StabilizedRSF:number=null;
    PurchasePrice:number=null;
    PurchasePricePSF:number=null;
    StabilizedBasis:number=null;
    StabilizedBasisPSF:number=null;
    LabMarketRentPSFAnn:number=null;
    LabMarketRentPSFMon:number=null;
    HardCostsPSF:number=null;
    TenantImprovementsPSF:number=null;
    ConversionCostPSF:number=null;
    UntrendedYoC:number=null;
    Funds: Funds = new Funds();
}

class Funds {
  ID: null;
  Title: null;
}


