class Sensor {
    constructor(){
        this.status = '';
        this.powerStatus = 'off';
        this.reportingInterval = 10000;
    }

    turn(toggle){
        if(toggle === 'on' && this.powerStatus === 'on') {
            throw new Error('이미 켜진 상태입니다.');
        }
        this.powerStatus = toggle;
        this.status = 'idle';
        if(this.status === 'idle'){
            setTimeout(() => {
                this.status = 'sensingDistance';
            },10000);
        }
        if(this.status === 'sensingDistance'){
            setTimeout(() => {
                this.status = 'reportingData';
            },500);
        }
    }
}

class IotServer {}

module.exports = {
    Sensor,
    IotServer,
};
