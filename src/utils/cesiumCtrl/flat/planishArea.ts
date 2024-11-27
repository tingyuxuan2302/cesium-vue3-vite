class PlanishArea {
    // 平整区域名称
    name: string;
  
    /** uuid */
    uuid: string;
  
    // 平整区域点数组
    area: Array<number>;
  
    // 平整高度
    height: number | null;
  
    show: boolean;
  
    constructor() {
      this.name = '区域';
      this.uuid = this.createUUID();
      this.area = [];
      this.height = null;
      this.show = true;
    }
  
    private createUUID() {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }
      return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
    }
  }
  
  class PlanishOptions {
    // 版本号
    version: string;
  
    // 自定义场地平整数据
    customPlanishArr: PlanishArea[];
  
    constructor() {
      this.version = '1.0';
      this.customPlanishArr = [];
    }
  
    public copyData(PlanishOptions: PlanishOptions) {
      if (!PlanishOptions) return;
  
      this.version = PlanishOptions.version;
      this.customPlanishArr = PlanishOptions.customPlanishArr;
    }
  }
  
export { PlanishOptions, PlanishArea };
  