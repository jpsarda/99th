/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var carSize=cc.size(30,40);
var minDistanceCar=carSize.height*1.5;
var startingDistance=(carSize.height*1.8)/2;
var roadCarWidthOffset=carSize.width*0.8;
var carsCruiseSpeed=300;
var heroPenaltyMinDiffSpeed=50;
var heroSpeedPenalty=0.97;
var carsMaxRank=99;
var roadMarkHeigh=25;
var roadMarkMargin=100;
var roadMarkPatternHeight=roadMarkHeigh+roadMarkMargin;


var RoadNode = cc.Sprite.extend({
    size:null,
    ctor:function () {
        this._super();
        this.size = cc.Director.getInstance().getWinSize();
    },
    draw:function () {
        cc.renderContext.fillStyle = "rgba(0,0,0,1)";
        
        
        cc.renderContext.lineCap = "square";


        cc.renderContext.strokeStyle = "rgba(0,150,0,1)";
        cc.renderContext.lineWidth = 4;

        var y=Math.floor((-this._position.y)/roadMarkPatternHeight)*roadMarkPatternHeight;
        var topY=-this._position.y+this.size.height;
        

        var markY=startingDistance*carsMaxRank;

        if (markY>-this._position.y-4) {
            var side=1;
            markY=0;
            for (var i=0;i<carsMaxRank;i++) {
                var baseMark=cc.p(-side*roadCarWidthOffset,markY);
                var ratio=0.6;
                cc.drawingUtil.drawLine(cc.p(baseMark.x-carSize.width*ratio,baseMark.y),cc.p(baseMark.x+carSize.width*ratio,baseMark.y));
                cc.drawingUtil.drawLine(cc.p(baseMark.x-carSize.width*ratio,baseMark.y+2),cc.p(baseMark.x-carSize.width*ratio,baseMark.y-8));
                cc.drawingUtil.drawLine(cc.p(baseMark.x+carSize.width*ratio,baseMark.y+2),cc.p(baseMark.x+carSize.width*ratio,baseMark.y-8));
      
                markY+=startingDistance;
                side*=-1;
            }
        }

        var squareSize=16;
        var squareCount=10;

        if (markY+4*squareSize>-this._position.y) {

            var squareStartX=-(squareCount-1)*squareSize*0.5;
            cc.renderContext.lineWidth = squareSize;
            var odd=0;
            for (var i=0;i<4;i++) {
                var startX=squareStartX;
                for (var j=0;j<squareCount;j++) {
                    if (odd%2==0) {
                        cc.drawingUtil.drawLine(cc.p(startX-squareSize*0.5,markY),cc.p(startX+squareSize*0.5,markY));
                    }
                    startX+=squareSize;
                    odd++;
                }
                odd++;
                markY+=squareSize;
            }
        }


        cc.renderContext.strokeStyle = "rgba(0,180,0,1)";
        cc.renderContext.lineWidth = 8;
        

        for (;true;) {
            if (y>markY) {
                cc.drawingUtil.drawLine(cc.p(0,y),cc.p(0,y+roadMarkHeigh));
            }
            y+=roadMarkPatternHeight;
            if (y>topY) {
                break;
            }
        }

        


        /*
        var s = this.getContentSize();
        var carRoundDist=s.width*this._carRoundWidthRatio;
        var offset=cc.size(s.width*0.5,s.height*0.5);
        var vertices;

        var wheelHeight=s.height*this._wheelHeightRatio;
        var wheelMarginHeight=s.height*this._wheelMarginHeightRatio;
        var wheelWidth=s.width*this._wheelWidthRatio;

        vertices = [ cc.p(-offset.width+wheelWidth,-offset.height+carRoundDist),cc.p(-offset.width+wheelWidth+carRoundDist,-offset.height+0),cc.p(-offset.width+s.width-wheelWidth-carRoundDist,-offset.height+0),cc.p(-offset.width+s.width-wheelWidth,-offset.height+carRoundDist)    
                    ,cc.p(-offset.width+s.width-wheelWidth,-offset.height+wheelMarginHeight+this._wheelOffsetBR.y),cc.p(-offset.width+s.width+this._wheelOffsetBR.x,-offset.height+wheelMarginHeight+this._wheelOffsetBR.y),cc.p(-offset.width+s.width+this._wheelOffsetBR.x,-offset.height+wheelMarginHeight+wheelHeight+this._wheelOffsetBR.y),cc.p(-offset.width+s.width-wheelWidth,-offset.height+wheelMarginHeight+wheelHeight+this._wheelOffsetBR.y)       ,cc.p(-offset.width+s.width-wheelWidth,-offset.height+s.height-wheelMarginHeight-wheelHeight+this._wheelOffsetTR.y),cc.p(-offset.width+s.width+this._wheelOffsetTR.x,-offset.height+s.height-wheelMarginHeight-wheelHeight+this._wheelOffsetTR.y),cc.p(-offset.width+s.width+this._wheelOffsetTR.x,-offset.height+s.height-wheelMarginHeight+this._wheelOffsetTR.y),cc.p(-offset.width+s.width-wheelWidth,-offset.height+s.height-wheelMarginHeight+this._wheelOffsetTR.y)
                    ,cc.p(-offset.width+s.width-wheelWidth,-offset.height+s.height-carRoundDist),cc.p(-offset.width+s.width-wheelWidth-carRoundDist,-offset.height+s.height),cc.p(-offset.width+wheelWidth+carRoundDist,-offset.height+s.height),cc.p(-offset.width+wheelWidth,-offset.height+s.height-carRoundDist)
                    ,cc.p(-offset.width+wheelWidth,-offset.height+s.height-wheelMarginHeight+this._wheelOffsetTL.y),cc.p(-offset.width+this._wheelOffsetTL.x,-offset.height+s.height-wheelMarginHeight+this._wheelOffsetTL.y),cc.p(-offset.width+this._wheelOffsetTL.x,-offset.height+s.height-wheelMarginHeight-wheelHeight+this._wheelOffsetTL.y),cc.p(-offset.width+wheelWidth,-offset.height+s.height-wheelMarginHeight-wheelHeight+this._wheelOffsetTL.y)           ,cc.p(-offset.width+wheelWidth,-offset.height+wheelMarginHeight+wheelHeight+this._wheelOffsetBL.y),cc.p(-offset.width+this._wheelOffsetBL.x,-offset.height+wheelMarginHeight+wheelHeight+this._wheelOffsetBL.y),cc.p(-offset.width+this._wheelOffsetBL.y,-offset.height+wheelMarginHeight+this._wheelOffsetBL.y),cc.p(-offset.width+wheelWidth,-offset.height+wheelMarginHeight+this._wheelOffsetBL.y)                 ];
        cc.drawingUtil.drawPoly(vertices, 0, true);

        var centerMarginHeight=s.height*0.22;
        var centerMarginWidth=wheelWidth+s.height*0.05;
        var centerOffsetHeight=s.height*this._centerOffsetHeightRatio;
        var centerRoundDist=carRoundDist;
        vertices = [cc.p(-offset.width+centerMarginWidth,-offset.height+centerMarginHeight-centerOffsetHeight+centerRoundDist),cc.p(-offset.width+centerMarginWidth+centerRoundDist,-offset.height+centerMarginHeight-centerOffsetHeight),cc.p(-offset.width+s.width-centerMarginWidth-centerRoundDist,-offset.height+centerMarginHeight-centerOffsetHeight),cc.p(-offset.width+s.width-centerMarginWidth,-offset.height+centerMarginHeight-centerOffsetHeight+centerRoundDist),cc.p(-offset.width+s.width-centerMarginWidth,-offset.height+s.height-centerMarginHeight-centerOffsetHeight-centerRoundDist),cc.p(-offset.width+s.width-centerMarginWidth-centerRoundDist,-offset.height+s.height-centerMarginHeight-centerOffsetHeight),cc.p(-offset.width+centerMarginWidth+centerRoundDist,-offset.height+s.height-centerMarginHeight-centerOffsetHeight),cc.p(-offset.width+centerMarginWidth,-offset.height+s.height-centerMarginHeight-centerOffsetHeight-centerRoundDist)];
        cc.drawingUtil.drawPoly(vertices, 0, true);
        */
    }
});


var Car = cc.Class.extend({
    _sprite:null,
    road:null,
    _previousCar:null,
    _distancePrevious:0,
    _distancePreviousOrigin:0,
    _side:0,
    _speed:0,
    _cruiseReached:0,
    _positionX:0,
    _positionY:0,
    _startOffset:8,

    ctor:function (road,previousCar,side,distancePrevious,rank) {
        //this._super();
        this.road=road;
        this._side=side;
        this._distancePreviousOrigin=distancePrevious;
        this._previousCar=previousCar;


        this._sprite = new CarSprite(rank);
        this.road.addChild(this._sprite, 2);

        this.reset();

        //console.log('s this._positionCar='+this._positionX+","+this._positionX);
    },
    reset:function() {
        this._speed=0;
        this._cruiseReached=0;

        var size=this._sprite.getContentSize();
        
        this._positionX=this._side*roadCarWidthOffset;
        if (this._previousCar!=null) {
            this._positionY=this._previousCar.getTopPositionY()+startingDistance-size.height*0.5;
            var previousSize=this._previousCar.getSize();
            if (this._distancePreviousOrigin>0) {
                this._distancePrevious=this._distancePreviousOrigin+size.height*0.5+previousSize.width*0.5;
            } else {
                this._distancePrevious=-1;
            }
        } else {
            this._positionY=0-size.height*0.5-this._startOffset;
            this._distancePrevious=-1;
        }

        this._sprite.setPosition(cc.p(this._positionX,this._positionY));
        this._sprite.setSpeed(this._speed);

        this.step(0);
    },
    hit:function(car) {
        return cc.Rect.CCRectIntersectsRect(this.getRect(), car.getRect());
    },
    getRect:function() {
        var size=this._sprite.getContentSize();
        return cc.rect(this._positionX-size.width*0.5,this._positionY-size.height*0.5, size.width, size.height);
    },
    getSize:function() {
        return this._sprite.getContentSize();
    },
    getTopPositionY:function() {
        var size=this._sprite.getContentSize();
        return this._positionY+size.height*0.5;//+this._startOffset;
    },
    getBottomPositionY:function() {
        var size=this._sprite.getContentSize();
        return this._positionY-size.height*0.5;
    },
    getPosition:function() {
        return cc.p(this._positionX,this._positionY);
    },
    step:function (dt) {
        if (this._cruiseReached==1) {
            if (this._distancePrevious>0) {
                //var previousPosition=this._previousCar.getPosition();
                this._positionY=this._previousCar._positionY+this._distancePrevious;
            } else {
                this._positionY+=this._speed*dt;
            }
        } else {
            this._speed+=180*dt;
            this._positionY+=this._speed*dt;

            if (this._distancePrevious>0) {
                //var previousPosition=this._previousCar.getPosition();
                if (this._positionY-this._previousCar._positionY>=this._distancePrevious) {
                    this._cruiseReached=1;
                    this._speed=carsCruiseSpeed;
                    this._positionY=this._previousCar._positionY+this._distancePrevious;
                }
            } else {
                if (this._speed>=carsCruiseSpeed) {
                    this._cruiseReached=1;
                    this._speed=carsCruiseSpeed;
                }
            }

            this._sprite.setSpeed(this._speed);
        }

        //console.log('this._positionCar='+this._positionCar.x+","+this._positionCar.y);
        this._sprite.setPosition(cc.p(this._positionX,this._positionY));
        this._sprite.step(dt);
    }
});


var HeroCar = Car.extend({
    _hitSideCar:null,
    _hitFrontCar:null,
    _speedDiffBeforeSideHit:-1,
    _successiveHitCount:0,
    stepCollision:0,
    ctor:function (road,previousCar,side,distancePrevious,rank) {
        this._super(road,previousCar,side,distancePrevious,rank);
        this._sprite.setContentSize(carSize);
    },
    reset:function() {
        this._successiveHitCount=0;
        this._speedDiffBeforeSideHit=-1;
        this._hitFrontCar=null;
        this._hitSideCar=null;

        this._super();
    },
    switchSide:function() {
        this._side*=-1;
        this._positionX=this._side*roadCarWidthOffset;
        this._hitSideCar=null;
        this._speedBeforeSideHit=-1;
    },
    setPositionOnSideOf:function(car) {
        var sideCarRect=car.getRect();
        var size=this._sprite.getContentSize();
        if (this._side==-1) {
            this._positionX=sideCarRect.origin.x+sideCarRect.size.width+size.width*0.5;
        } else {
            this._positionX=sideCarRect.origin.x-size.width*0.5;
        }
        this.stepCollision=1;
        this._successiveHitCount++;
    },
    setHitSideCar:function(car) {
        this._speedBeforeSideHit=this._speed-car._speed;
        this._hitSideCar=car;
        this.setPositionOnSideOf(this._hitSideCar);
    },
    follow:function(car) {
        this._hitFrontCar=car;
        var size=this._sprite.getContentSize();
        this._positionY=car.getBottomPositionY()-size.height*0.5;
        this.stepCollision=1;
        this._successiveHitCount++;
        this._sprite.setPosition(cc.p(this._positionX,this._positionY));
    },
    sideCarCollision:function (dt) {
        if (this._hitSideCar!=null) {
            this._positionY+=5; //this._speed*dt; //one step ahead
            this._positionX=this._side*roadCarWidthOffset;
            if (this.hit(this._hitSideCar)) {
                this._positionY-=5; //this._speed*dt;
                this.setPositionOnSideOf(this._hitSideCar);
            } else {
                this._positionY-=this._speed*dt;

                if (this.hit(this._hitSideCar)) {
                    this._positionY+=((this._hitSideCar.getTopPositionY()+this._sprite._contentSize.height*0.5)-this._positionY)*0.5;
                }

                this._hitSideCar=null;
                this._speedBeforeSideHit=-1;
            }
            this._sprite.setPosition(cc.p(this._positionX,this._positionY));
        }
    },
    step:function (dt) {
        this._speed+=125*dt*1/((this._speed)*0.0075+1);

        if (this._successiveHitCount>2) {
            this._speed*=heroSpeedPenalty;
            if (this._hitSideCar!=null) {
                if (this._speedBeforeSideHit<heroPenaltyMinDiffSpeed) {
                    if (this._speed<this._hitSideCar._speed+this._speedBeforeSideHit) {
                        this._speed=this._hitSideCar._speed+this._speedBeforeSideHit;
                    }
                } else {
                    if (this._speed<this._hitSideCar._speed+heroPenaltyMinDiffSpeed) {
                        this._speed=this._hitSideCar._speed+heroPenaltyMinDiffSpeed;
                    }
                }
            } else if (this._hitFrontCar!=null) {
                if (this._speed<this._hitFrontCar._speed+heroPenaltyMinDiffSpeed) {
                    this._speed=this._hitFrontCar._speed+heroPenaltyMinDiffSpeed;
                }
            }
        }

        this._positionY+=this._speed*dt;

        this._sprite.setSpeed(this._speed);

        this._sprite.setPosition(cc.p(this._positionX,this._positionY));
        this._sprite.step(dt);
    }
});


var CarSprite = cc.Sprite.extend({
    _startingPos:0,
    _wheelHeightRatio:0.2,
    _wheelMarginHeightRatio:0.15,
    _wheelWidthRatio:0.05,
    _carRoundWidthRatio:0.1,
    _centerOffsetHeightRatio:0.05,
    _rankingLabel:null,
    _shakeAmplitude:0,
    _speed:0,
    _wheelOffsetBL:cc.size(0,0),
    _wheelOffsetTL:cc.size(0,0),
    _wheelOffsetBR:cc.size(0,0),
    _wheelOffsetTR:cc.size(0,0),
    _wheelShakeBaseRatio:0.1,
    ctor:function (startingPos) {
        this._super();
        this._startingPos=startingPos;
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.setContentSize(cc.size(carSize.width*(1-Math.random()*0.2),carSize.height*(1.33-Math.random()*0.66)));
        this.setSpeed(0);
        this.step(0);
    },
    setContentSize:function (s) {
        this._super(s);
        if (!this._rankingLabel) {
            this._rankingLabel = cc.LabelTTF.create(this._startingPos+"", "Arial Black", 12);
            this._rankingLabel.setScale(1);
            this.addChild(this._rankingLabel, 5);
        }
        // position the label on the center of the screen
        this._rankingLabel.setPosition(cc.p(s.width*0.5, s.height*0.5-s.height*this._centerOffsetHeightRatio)-2);
        this._rankingLabel.setColor(cc.c3b(0,255,0));
    },
    draw:function () {
        cc.renderContext.fillStyle = "rgba(0,0,0,1)";
        cc.renderContext.strokeStyle = "rgba(0,255,0,1)";
        cc.renderContext.lineWidth = 2;
        cc.renderContext.lineCap = "square";

        var s = this.getContentSize();
        var carRoundDist=s.width*this._carRoundWidthRatio;
        var offset=cc.size(s.width*0.5,s.height*0.5);
        var vertices;

        var wheelHeight=s.height*this._wheelHeightRatio;
        var wheelMarginHeight=s.height*this._wheelMarginHeightRatio;
        var wheelWidth=s.width*this._wheelWidthRatio;

        vertices = [ cc.p(-offset.width+wheelWidth,-offset.height+carRoundDist),cc.p(-offset.width+wheelWidth+carRoundDist,-offset.height+0),cc.p(-offset.width+s.width-wheelWidth-carRoundDist,-offset.height+0),cc.p(-offset.width+s.width-wheelWidth,-offset.height+carRoundDist)    
                    ,cc.p(-offset.width+s.width-wheelWidth,-offset.height+wheelMarginHeight+this._wheelOffsetBR.y),cc.p(-offset.width+s.width+this._wheelOffsetBR.x,-offset.height+wheelMarginHeight+this._wheelOffsetBR.y),cc.p(-offset.width+s.width+this._wheelOffsetBR.x,-offset.height+wheelMarginHeight+wheelHeight+this._wheelOffsetBR.y),cc.p(-offset.width+s.width-wheelWidth,-offset.height+wheelMarginHeight+wheelHeight+this._wheelOffsetBR.y)       ,cc.p(-offset.width+s.width-wheelWidth,-offset.height+s.height-wheelMarginHeight-wheelHeight+this._wheelOffsetTR.y),cc.p(-offset.width+s.width+this._wheelOffsetTR.x,-offset.height+s.height-wheelMarginHeight-wheelHeight+this._wheelOffsetTR.y),cc.p(-offset.width+s.width+this._wheelOffsetTR.x,-offset.height+s.height-wheelMarginHeight+this._wheelOffsetTR.y),cc.p(-offset.width+s.width-wheelWidth,-offset.height+s.height-wheelMarginHeight+this._wheelOffsetTR.y)
                    ,cc.p(-offset.width+s.width-wheelWidth,-offset.height+s.height-carRoundDist),cc.p(-offset.width+s.width-wheelWidth-carRoundDist,-offset.height+s.height),cc.p(-offset.width+wheelWidth+carRoundDist,-offset.height+s.height),cc.p(-offset.width+wheelWidth,-offset.height+s.height-carRoundDist)
                    ,cc.p(-offset.width+wheelWidth,-offset.height+s.height-wheelMarginHeight+this._wheelOffsetTL.y),cc.p(-offset.width+this._wheelOffsetTL.x,-offset.height+s.height-wheelMarginHeight+this._wheelOffsetTL.y),cc.p(-offset.width+this._wheelOffsetTL.x,-offset.height+s.height-wheelMarginHeight-wheelHeight+this._wheelOffsetTL.y),cc.p(-offset.width+wheelWidth,-offset.height+s.height-wheelMarginHeight-wheelHeight+this._wheelOffsetTL.y)           ,cc.p(-offset.width+wheelWidth,-offset.height+wheelMarginHeight+wheelHeight+this._wheelOffsetBL.y),cc.p(-offset.width+this._wheelOffsetBL.x,-offset.height+wheelMarginHeight+wheelHeight+this._wheelOffsetBL.y),cc.p(-offset.width+this._wheelOffsetBL.x,-offset.height+wheelMarginHeight+this._wheelOffsetBL.y),cc.p(-offset.width+wheelWidth,-offset.height+wheelMarginHeight+this._wheelOffsetBL.y)                 ];
        cc.drawingUtil.drawPoly(vertices, 0, true);

        var centerMarginHeight=s.height*0.22;
        var centerMarginWidth=wheelWidth+s.height*0.05;
        var centerOffsetHeight=s.height*this._centerOffsetHeightRatio;
        var centerRoundDist=carRoundDist;
        vertices = [cc.p(-offset.width+centerMarginWidth,-offset.height+centerMarginHeight-centerOffsetHeight+centerRoundDist),cc.p(-offset.width+centerMarginWidth+centerRoundDist,-offset.height+centerMarginHeight-centerOffsetHeight),cc.p(-offset.width+s.width-centerMarginWidth-centerRoundDist,-offset.height+centerMarginHeight-centerOffsetHeight),cc.p(-offset.width+s.width-centerMarginWidth,-offset.height+centerMarginHeight-centerOffsetHeight+centerRoundDist),cc.p(-offset.width+s.width-centerMarginWidth,-offset.height+s.height-centerMarginHeight-centerOffsetHeight-centerRoundDist),cc.p(-offset.width+s.width-centerMarginWidth-centerRoundDist,-offset.height+s.height-centerMarginHeight-centerOffsetHeight),cc.p(-offset.width+centerMarginWidth+centerRoundDist,-offset.height+s.height-centerMarginHeight-centerOffsetHeight),cc.p(-offset.width+centerMarginWidth,-offset.height+s.height-centerMarginHeight-centerOffsetHeight-centerRoundDist)];
        cc.drawingUtil.drawPoly(vertices, 0, true);
    },
    setSpeed:function(s) {
        this._speed=s;
        this._shakeAmplitude=(1-1/((s+20)*0.005+1));
    },
    step:function (dt) {
        if (!this._visible) return;
        //this._radians -= 6;
        //this._addDirtyRegionToDirector(this.getBoundingBoxToWorld());
        this._carRoundWidthRatio=0.1+Math.random()*0.075*this._shakeAmplitude;
        this._wheelHeightRatio=0.2+Math.random()*0.075*this._shakeAmplitude;
        this._wheelWidthRatio=0.05+Math.random()*0.05*this._shakeAmplitude;
        this._centerOffsetHeightRatio=0.025+Math.random()*0.075*this._shakeAmplitude;

        var s=this.getContentSize();

        var wheelShakeBase=this._wheelShakeBaseRatio*s.width;
        this._wheelOffsetBL=cc.p((Math.random()-0.5)*wheelShakeBase*this._shakeAmplitude,(Math.random()-0.5)*wheelShakeBase*this._shakeAmplitude);
        this._wheelOffsetTL=cc.p((Math.random()-0.5)*wheelShakeBase*this._shakeAmplitude,(Math.random()-0.5)*wheelShakeBase*this._shakeAmplitude);
        this._wheelOffsetBR=cc.p((Math.random()-0.5)*wheelShakeBase*this._shakeAmplitude,(Math.random()-0.5)*wheelShakeBase*this._shakeAmplitude);
        this._wheelOffsetTR=cc.p((Math.random()-0.5)*wheelShakeBase*this._shakeAmplitude,(Math.random()-0.5)*wheelShakeBase*this._shakeAmplitude);

        this._rankingLabel.setPosition(cc.p(s.width*0.5, s.height*0.5-s.height*this._centerOffsetHeightRatio-2));
    }
});


var GameEngineRace = cc.Layer.extend({
    //isMouseDown:false,
    //helloImg:null,
    //helloLabel:null,
    //circle:null,
    //sprite:null,
    size:null,
    road:null,
    cars:null,
    hero:null,
    state:0,
    rankLabel:null,
    speedLabel:null,
    timeLabel:null,
    labels:null,
    time:0,
    rank:carsMaxRank,
    distances:null,
    restartDogPositionY:0,
    restartDogSpeed:0,

    init:function () {
        var selfPointer = this;
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        this.size = cc.Director.getInstance().getWinSize();

        /*
        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = cc.MenuItemImage.create(
            "res/CloseNormal.png",
            "res/CloseSelected.png",
            function () {
                history.go(-1);
            },this);
        closeItem.setAnchorPoint(cc.p(0.5, 0.5));

        var menu = cc.Menu.create(closeItem);
        menu.setPosition(cc.PointZero());
        this.addChild(menu, 1);
        closeItem.setPosition(cc.p(this.size.width - 20, 20));
        */

        
        this.distances=new Array();
        var i=carsMaxRank-1;

        this.distances[i]=-1; i--;
        this.distances[i]=minDistanceCar+150; i--;
        this.distances[i]=minDistanceCar+150; i--;
        this.distances[i]=minDistanceCar+100; i--;
        this.distances[i]=minDistanceCar+25; i--;
        this.distances[i]=minDistanceCar+25; i--;

        this.distances[i]=minDistanceCar+300; i--;
        this.distances[i]=minDistanceCar+20; i--;
        this.distances[i]=minDistanceCar+20; i--;
        this.distances[i]=minDistanceCar+20; i--;

        this.distances[i]=minDistanceCar+300; i--;
        this.distances[i]=minDistanceCar+25; i--;
        this.distances[i]=minDistanceCar+25; i--;

        this.distances[i]=minDistanceCar+200; i--;
        this.distances[i]=minDistanceCar+25; i--;
        this.distances[i]=minDistanceCar+25; i--;

        this.distances[i]=minDistanceCar+200; i--;
        this.distances[i]=minDistanceCar+25; i--;
        this.distances[i]=minDistanceCar+25; i--;

        this.distances[i]=minDistanceCar+100; i--;
        this.distances[i]=minDistanceCar+25; i--;
        this.distances[i]=minDistanceCar+25; i--;
        this.distances[i]=minDistanceCar+25; i--;
        this.distances[i]=minDistanceCar+25; i--;
        
        this.distances[i]=minDistanceCar+100; i--;
        this.distances[i]=minDistanceCar+100; i--;
        this.distances[i]=minDistanceCar+100; i--;

        this.distances[i]=minDistanceCar+300; i--;
        this.distances[i]=minDistanceCar+50; i--;
        this.distances[i]=minDistanceCar+50; i--;
        this.distances[i]=minDistanceCar+50; i--;
        this.distances[i]=minDistanceCar+100; i--;
        this.distances[i]=minDistanceCar+50; i--;
        this.distances[i]=minDistanceCar+50; i--;

        this.distances[i]=minDistanceCar+200; i--;
        this.distances[i]=minDistanceCar+25; i--;
        this.distances[i]=minDistanceCar+25; i--;

        this.distances[i]=minDistanceCar+200; i--;
        this.distances[i]=minDistanceCar+25; i--;
        this.distances[i]=minDistanceCar+25; i--;

        this.distances[i]=minDistanceCar+200; i--;
        this.distances[i]=minDistanceCar+25; i--;
        this.distances[i]=minDistanceCar+25; i--;
        this.distances[i]=minDistanceCar+100; i--;
        this.distances[i]=minDistanceCar+25; i--;
        this.distances[i]=minDistanceCar+25; i--;
        this.distances[i]=minDistanceCar+25; i--;

        this.distances[i]=minDistanceCar+200; i--;
        this.distances[i]=minDistanceCar+5; i--;
        this.distances[i]=minDistanceCar+25; i--;

        this.distances[i]=minDistanceCar+100; i--;
        this.distances[i]=minDistanceCar+5; i--;
        this.distances[i]=minDistanceCar+25; i--;

        this.distances[i]=minDistanceCar+200; i--;
        this.distances[i]=minDistanceCar+50; i--;
        this.distances[i]=minDistanceCar+50; i--;
        this.distances[i]=minDistanceCar+50; i--;
        this.distances[i]=minDistanceCar+50; i--;
        this.distances[i]=minDistanceCar+75; i--;
        this.distances[i]=minDistanceCar+100; i--;

        this.distances[i]=minDistanceCar+200; i--;
        this.distances[i]=minDistanceCar+25; i--;
        this.distances[i]=minDistanceCar+25; i--;

        this.distances[i]=minDistanceCar+200; i--;
        this.distances[i]=minDistanceCar+50; i--;
        this.distances[i]=minDistanceCar+50; i--;
        this.distances[i]=minDistanceCar+50; i--;
        this.distances[i]=minDistanceCar+50; i--;
        this.distances[i]=minDistanceCar+50; i--;
        this.distances[i]=minDistanceCar+50; i--;
        this.distances[i]=minDistanceCar+50; i--;
        this.distances[i]=minDistanceCar+50; i--;
        this.distances[i]=minDistanceCar+50; i--;
        this.distances[i]=minDistanceCar+50; i--;
        this.distances[i]=minDistanceCar+50; i--;
        this.distances[i]=minDistanceCar+50; i--;

        this.distances[i]=minDistanceCar+200; i--;
        this.distances[i]=minDistanceCar+25; i--;
        this.distances[i]=minDistanceCar+25; i--;

        this.distances[i]=minDistanceCar+100; i--;
        this.distances[i]=minDistanceCar+150; i--;
        this.distances[i]=minDistanceCar+150; i--;
        this.distances[i]=minDistanceCar+100; i--;
        this.distances[i]=minDistanceCar+150; i--;
        this.distances[i]=minDistanceCar+150; i--;

        this.distances[i]=minDistanceCar+25; i--;
        this.distances[i]=minDistanceCar+25; i--;
        this.distances[i]=minDistanceCar+25; i--;

        this.distances[i]=minDistanceCar+100; i--;
        this.distances[i]=minDistanceCar+50; i--;
        this.distances[i]=minDistanceCar+100; i--;
        this.distances[i]=minDistanceCar+50; i--;
        this.distances[i]=minDistanceCar+100; i--;
        this.distances[i]=minDistanceCar+50; i--;
        this.distances[i]=minDistanceCar+100; i--;
        this.distances[i]=minDistanceCar+50; i--;
        this.distances[i]=minDistanceCar+50; i--;
        this.distances[i]=minDistanceCar+25; i--;
        

        console.log("i="+i);

        Math.seedrandom('mydistances');
        for (;i>0;i--) {
            this.distances[i] = minDistanceCar+Math.random()*100;
        }

        this.distances[carsMaxRank-1]=-1;


        this.road=new RoadNode();
        this.road.setPosition(cc.p(this.size.width*0.5,0));
        this.addChild(this.road,2);

        this.labels=new cc.Node();
        this.labels.setPosition(cc.p(0,0));
        this.addChild(this.labels,100);

        this.rankLabel=cc.LabelTTF.create("XXth", "Arial Black", 16);
        this.rankLabel.setColor(cc.c3b(0,255,0));
        this.rankLabel.setPosition(cc.p(this.size.width*0.15,6));
        this.labels.addChild(this.rankLabel,100);
        this.speedLabel=cc.LabelTTF.create("X.X mph", "Arial Black", 16);
        this.speedLabel.setColor(cc.c3b(0,255,0));
        this.speedLabel.setPosition(cc.p(this.size.width*0.85,6));
        this.labels.addChild(this.speedLabel,100);
        this.timeLabel=cc.LabelTTF.create("XX:XX:XXX", "Arial Black", 16);
        this.timeLabel.setColor(cc.c3b(0,255,0));
        this.timeLabel.setPosition(cc.p(this.size.width*0.5,6));
        this.labels.addChild(this.timeLabel,100);

        Math.seedrandom('mycars');

        var side=-1;
        this.hero=new HeroCar(this.road,null,side,-1,carsMaxRank);
        this.hero.step(0);
        side*=-1;

        var previousCar=this.hero;
        
        this.cars=new Array();
        for (var i=carsMaxRank-1;i>0;i--) {
            this.cars[i] = new Car(this.road,previousCar,side,this.distances[i],i);
            side*=-1;
            previousCar=this.cars[i];
        }

        this.schedule(this.step, 1 / 60);
        
        

        //this.step(0);

        this.road.setPosition(cc.p(this.road._position.x, -carsMaxRank*startingDistance+this.size.height*0.5));
        //cc.EaseInOut
        this.road.runAction(cc.Sequence.create(cc.EaseInOut.create(cc.MoveTo.create(4, cc.p(this.road._position.x,-this.hero._positionY+75)),5), cc.CallFunc.create(this.introScrollingDone,this)));

        if( 'keyboard' in sys.capabilities )
            this.setKeyboardEnabled(true);

        if( 'mouse' in sys.capabilities )
            this.setMouseEnabled(true);

        if( 'touches' in sys.capabilities )
            this.setTouchEnabled(true);

        //this.setTouchEnabled(true);
        this.adjustSizeForWindow();
        //lazyLayer.adjustSizeForCanvas();
        window.addEventListener("resize", function (event) {
            selfPointer.adjustSizeForWindow();
        });
        return true;
    },
    removeRestartLabel:function() {
        this.removeChildByTag(1234,true);
    },
    interruptRestart:function() {
        this.restartDogPositionY=this.hero._positionY;
        this.restartDogSpeed=this.hero._speed;
        this.state=11;

        this.road.runAction(cc.Sequence.create(cc.EaseOut.create(cc.MoveBy.create(0.5, cc.p(this.size.width,0)),0.5), cc.CallFunc.create(this.reset,this,true)));
    },
    restart:function() {
        this.restartDogPositionY=this.hero._positionY;
        this.restartDogSpeed=this.hero._speed;
        this.state=10;

        var restartLabel=this.getChildByTag(1234);
        restartLabel.runAction(cc.Sequence.create(cc.EaseOut.create(cc.MoveTo.create(0.5, cc.p(restartLabel._position.x,-100)),0.5), cc.CallFunc.create(this.removeRestartLabel,this)));

        this.timeLabel.runAction(cc.Sequence.create(cc.EaseOut.create(cc.MoveTo.create(0.5, cc.p(this.timeLabel._position.x,6)),0.5)));
        this.timeLabel.runAction(cc.Sequence.create(cc.EaseOut.create(cc.ScaleTo.create(0.5, 1,1),0.5)));
    },
    reset:function(hard) {
        this.hero._side=-1;
        this.hero.reset();
        for (var i=carsMaxRank-1;i>0;i--) {
            var car=this.cars[i];
            car.reset();
        }
        
        this.state=0;

        if (hard) {
            this.road.setPosition(cc.p(this.size.width*0.5-(this.road._position.x-this.size.width*0.5),-this.hero._positionY+75));
            this.road.runAction(cc.Sequence.create(cc.EaseOut.create(cc.MoveTo.create(0.5, cc.p(this.size.width*0.5,this.road._position.y)),0.5), cc.CallFunc.create(this.introScrollingDone,this)));
        } else {
            var roadPositionY=this.road._position.y;
            var wantedRoadPositionY=-carsMaxRank*startingDistance-this.size.height*0.5;
            var diff=wantedRoadPositionY-roadPositionY;
            diff=Math.floor(diff/roadMarkPatternHeight)*roadMarkPatternHeight;

            wantedRoadPositionY=roadPositionY+diff;

            this.road.setPosition(cc.p(this.road._position.x, wantedRoadPositionY));
            this.road.runAction(cc.Sequence.create(cc.EaseInOut.create(cc.MoveTo.create(4, cc.p(this.road._position.x,-this.hero._positionY+75)),5), cc.CallFunc.create(this.introScrollingDone,this)));
        }

    },
    introScrollingDone:function() {
        this.state=1; //waiting action to start
        this.time=0;
        this.rank=carsMaxRank;
        this.updateLabels();
    },
    adjustSizeForWindow:function () {
        var margin = document.documentElement.clientWidth - document.body.clientWidth +50; //Add a 50px margin for scroling possible
        if (document.documentElement.clientWidth < cc.originalCanvasSize.width) {
            cc.canvas.width = cc.originalCanvasSize.width;
        } else {
            cc.canvas.width = document.documentElement.clientWidth - margin;
        }
        if (document.documentElement.clientHeight < cc.originalCanvasSize.height) {
            cc.canvas.height = cc.originalCanvasSize.height;
        } else {
            cc.canvas.height = document.documentElement.clientHeight - margin;
        }

        var xScale = cc.canvas.width / cc.originalCanvasSize.width;
        var yScale = cc.canvas.height / cc.originalCanvasSize.height;
        if (xScale > yScale) {
            xScale = yScale;
        }
        cc.canvas.width = cc.originalCanvasSize.width * xScale;
        cc.canvas.height = cc.originalCanvasSize.height * xScale;
        var parentDiv = document.getElementById("Cocos2dGameContainer");
        if (parentDiv) {
            parentDiv.style.width = cc.canvas.width + "px";
            parentDiv.style.height = cc.canvas.height + "px";
        }
        cc.renderContext.translate(0, cc.canvas.height);
        cc.renderContext.scale(xScale, xScale);
        cc.Director.getInstance().setContentScaleFactor(xScale);
    },
    // a selector callback
    menuCloseCallback:function (sender) {
        cc.Director.getInstance().end();
    },
    heroSwitch:function() {
        if (this.state==1) {
            this.state=2
            return;
        } else if (this.state==2) {
            this.hero.switchSide();
            var hitCar=this.collision();
            if (hitCar!=null) {
                //this.hero.switchSide();
                this.hero.setHitSideCar(hitCar);
            }
        } else if (this.state==3) {
            this.hero.switchSide();  
        }
    },
    onTouchesBegan:function (touches, event) {
        //this.isMouseDown = true;
        this.heroSwitch();
    },
    onMouseDown:function (event) {
        this.heroSwitch();
    },
    onTouchesMoved:function (touches, event) {
        /*
        if (this.isMouseDown) {
            if (touches) {
                //this.circle.setPosition(cc.p(touches[0].getLocation().x, touches[0].getLocation().y));
            }
        }
        */
    },
    onTouchesEnded:function (touches, event) {
        //this.isMouseDown = false;
    },
    onTouchesCancelled:function (touches, event) {
        console.log("onTouchesCancelled");
    },
    onKeyDown:function (e) {
        //console.log("onKeyDown "+e);
        if (!GG.KEYS[e]) {
            GG.KEYS[e] = true;
            this.heroSwitch();
        }
        if ((e==cc.KEY.r)||(e==cc.KEY.R)) {
            if (this.state==3) {
                this.restart();
            } else if (this.state==2) {
                this.interruptRestart();
            }
        }
    },
    onKeyUp:function (e) {
        //console.log("onKeyUp "+e);
        GG.KEYS[e] = false;
    },
    collision:function() {
        for (var i=carsMaxRank-1;i>0;i--) {
            var car = this.cars[i];
            if (car.hit(this.hero)) {
                return car;
            }
        }
        return null;
    },
    updateLabels:function() {
        var unity=this.rank-Math.floor(this.rank/10)*10
        if ((unity==1)&&((this.rank<10)||(this.rank>=20))) {
            this.rankLabel.setString(this.rank+"st");
        } else if (unity==2) {
            this.rankLabel.setString(this.rank+"nd");
        } else if (unity==3) {
            this.rankLabel.setString(this.rank+"rd");
        } else {
            this.rankLabel.setString(this.rank+"th");
        }
        
        //this.rankLabel.setString(this.rank+"th");
        var speed=Math.round(this.hero._speed*10/4)/10;
        if (Math.round(speed)==speed) speed=speed+".0";
        this.speedLabel.setString(speed+" mph");

        /*
        var timeSeconds=Math.floor(this.time);
        var timeMilliSeconds=Math.floor((this.time-timeSeconds)*1000);
        var timeMinutes=Math.floor(timeSeconds/60);
        timeSeconds-=timeMinutes*60;
        if (timeMinutes<10) timeMinutes="0"+timeMinutes;
        if (timeSeconds<10) timeSeconds="0"+timeSeconds;
        if (timeMilliSeconds<10) timeMilliSeconds="00"+timeMilliSeconds;
        else if (timeMilliSeconds<100) timeMilliSeconds="0"+timeMilliSeconds;
        var res=timeMinutes+":"+timeSeconds+":"+timeMilliSeconds;
        */


        var scoretext=getTimeText(this.time);

        this.timeLabel.setString(scoretext);
    },
    submitScore:function(score,scoretext) {
        newScore(score,scoretext)
    },
    step:function(dt) {
        //dt=1/60;
        if (this.state>=2) {
            if (this.state==2) this.time+=dt;
            var roadPosition=this.road.getPosition();
            var visibleRect=cc.rect(-this.size.width*0.5,-roadPosition.y,this.size.width,this.size.height);
            for (var i=carsMaxRank-1;i>0;i--) {
                var car = this.cars[i];
                car._sprite.setVisible(cc.Rect.CCRectIntersectsRect(visibleRect, car.getRect()));
                car.step(dt);
            }

            /*
            if ((GG.KEYS[cc.KEY.a] || GG.KEYS[cc.KEY.left])) {
                this.hero._positionX-=3;
            }
            if ((GG.KEYS[cc.KEY.d] || GG.KEYS[cc.KEY.right])) {
                this.hero._positionX+=3;
            }
            */

            this.hero.stepCollision=0;

            this.hero.step(dt);

            this.hero.sideCarCollision(dt);

            if (this.hero._hitSideCar==null) {
                var hitCar=this.collision();
                if (hitCar!=null) {
                    if (hitCar._positionY>this.hero._positionY) {
                        this.hero.follow(hitCar);
                    }
                }
            }

            if (this.hero.stepCollision==0) {
                this.hero._successiveHitCount=0;
            }

            //Collisions
            if (this.state>=10) {
                if (this.state==10) {
                    this.restartDogSpeed*=0.9;
                    this.restartDogPositionY+=this.restartDogSpeed*dt;
                    roadPosition.y=-this.restartDogPositionY+75;
                    this.road.setPosition(roadPosition);
                    if (this.restartDogSpeed<2) {
                        this.reset(false);
                    }
                }
            } else {
                roadPosition.y=-this.hero._positionY+75;
                this.road.setPosition(roadPosition);
            }
            

            var heroTopY=this.hero.getTopPositionY();
            for (var i=this.rank-1;i>0;i--) {
                var car = this.cars[i];
                var carTopY=car.getTopPositionY();
                if (heroTopY>carTopY) {
                    this.rank=i;
                    if (this.rank==1) {
                        this.state=3; //BINGO



                        this.timeLabel.runAction(cc.Sequence.create(cc.EaseOut.create(cc.MoveTo.create(0.5, cc.p(this.timeLabel._position.x,this.size.height*0.5)),0.5)));
                        this.timeLabel.runAction(cc.Sequence.create(cc.EaseOut.create(cc.ScaleTo.create(0.5, 3,3),0.5)));
                        //this.timeLabel.runAction(cc.Sequence.create(cc.EaseInOut.create(cc.MoveTo.create(1, cc.p(this.timeLabel._position.x,-this.size.height*0.5)),1), cc.CallFunc.create(this.introScrollingDone,this)));

                        var restartLabel=cc.LabelTTF.create("[R]ESTART", "Arial Black", 32);
                        restartLabel.setColor(cc.c3b(0,255,0));

                        var restartItem = cc.MenuItemLabel.create(restartLabel,this.restart,this);
                        restartItem.setAnchorPoint(cc.p(0.5, 0.5));

                        var menu = cc.Menu.create(restartItem);
                        menu.setPosition(cc.p(this.size.width*0.5,-100));
                        menu.setTag(1234);
                        this.addChild(menu, 101);
                        menu.runAction(cc.Sequence.create(cc.EaseOut.create(cc.MoveTo.create(0.5, cc.p(menu._position.x,this.size.height*0.5-100)),0.5)));

                        this.updateLabels();
                        this.submitScore(1000000000-Math.round(this.time*10000),this.timeLabel.getString());

                        break;
                    }
                } else {
                    break;
                }
            }
        } else if (this.state<=1) {
            var roadPosition=this.road.getPosition();
            var visibleRect=cc.rect(-this.size.width*0.5,-roadPosition.y,this.size.width,this.size.height);
            for (var i=carsMaxRank-1;i>0;i--) {
                var car = this.cars[i];
                car._sprite.setVisible(cc.Rect.CCRectIntersectsRect(visibleRect, car.getRect()));
                car._sprite.step(dt);
            }
            this.hero._sprite.step(dt);
        }
        if ((this.state>0)&&(this.state<10)) this.updateLabels();
    }
});

var GameEngineRaceScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameEngineRace();
        layer.init();
        this.addChild(layer);
    }
});

