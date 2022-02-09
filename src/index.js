class Sensor {
    constructor(deviceId){
        this.deviceId = deviceId;
        this.status = '';
        this.powerStatus = 'off';
        this.reportingInterval = 10000;
    }

    turn(toggle){
        let sensorTimeout;
        if(toggle === 'on'){
            if (this.powerStatus === 'on') {
                throw new Error('센서가 현재 켜진 상태입니다.');
            }
            this.powerStatus = 'on';
            this.status = 'idle';

            sensorTimeout = setTimeout(() => {
                this.status = 'sensingDistance';
                setTimeout(() => {
                    this.status = 'reportingData';
                    setTimeout(() => {
                        this.status = 'idle';
                    },1000);
                },500);
            },this.reportingInterval);
            
            /**
             * (setTimeout > setTimeout > setTimeout)
             * setInterval 은 실행 도중 다른 setInterval 이 불리면 기존 실행되던 setInterval이 종료됨
             * 따라서 아래 가정한 상황이 아님...
             * 
             * (setTimeout > setInterval > setInterval)
             * 이와같이 작성할 경우 idle은 단 10초만 유지되고 
             * 10초간 1초, 0.5초 단위로 status가 2종류로만 바뀔거같은데?
             * sensingDistance -> reportingData -> idle -> reportingData -> idle -> ,,, 
             * 10초뒤엔 마지막 status로 쭉 유지. 테스트는 통과하지만 의도한 동작은 아닌거같음. 
             * */ 


        } else if (toggle === 'off') {
            if (this.powerStatus === 'on'){
                this.powerStatus = 'off';
                clearTimeout(sensorTimeout); // 종료 시 기존 타임아웃 종료?
            }
        }
    }
}

class IotServer {
    constructor(){
        this.sensors = [];
    }

    start(sensors){
        this.sensors = sensors; // Array type
    }
    publish(data){
        // 입력받은 deviceId와 일치하는 Id 가진 센서 찾기.
        let [controlSensor] = this.sensors.filter(sensor => sensor.deviceId === data.deviceId) 

        // 켜져있을 때만 reportingInterval 바꾸기.
        if (data.actionId === 'CHANGE_REPORTING_INTERVAL' && controlSensor.powerStatus === 'on'){
            controlSensor.reportingInterval = data.payload;
        }
    }
}

module.exports = {
    Sensor,
    IotServer,
};
