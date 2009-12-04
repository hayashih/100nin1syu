/**
 * @author Hiromi Hayashi <hayashih+wavegadget@gmail.com>
 */
// 配列のシャッフル
Array.prototype.shuffle = function() {
    var i = this.length;
    while(i){
        var j = Math.floor(Math.random()*i);
        var t = this[--i];
        this[i] = this[j];
        this[j] = t;
    }
    return this;
}

// 札データ
var Fuda = function(data)
{
    this.number = "";
    this.content = "";
    this.background = "";
    this.visibility = "visible";
}

Fuda.defaultBGColor = "#F5F5DC";

// 札リスト
var FudaList = function(data)
{
    this.list = new Array();
    for(var i=0, l = data.length; i < l; i++)
    {
        var fuda = new Fuda();
        fuda.number = data[i].number;
        fuda.content = data[i].content;
        fuda.background = data[i].background ? data[i].background : Fuda.defaultBGColor;
        fuda.visibility = data[i].visibility ? data[i].visibility : "visible";
        this.list[i] = fuda;
    }
}


FudaList.prototype = {
    // 特定の札のデータを取得
    getItem : function(number)
    {
        var item = null;

        for(var i=0, l = this.list.length; i < l; i++ )
        {
            if( this.list[i].number == number )
             {
                item = this.list[i];
                break;
             }
        }

        return item;
    },

    // 札の色をデフォルト色に戻す
    setFudaColorDefault : function()
    {
        for(var i = 0, l = this.list.length; i < l; i++)
        {
            this.list[i].background = Fuda.defaultBGColor;
        }
    },
}


// 使用する歌の番号のリスト
var UtaList = function(data)
{
    this.list = new Array();
    
    for(var i=0, l = data.length; i < l; i++)
    {
        this.list[i] =  ({number: data[i].number});
    }
}

UtaList.prototype = {
    deleteFirstUta : function(){
        if( this.list.length > 0 )
        {
            this.list.splice(0,1);
        }
    },
}


var Game = function()
{
    this.data = [];
    
    this.utaList = {};
    this.fudaList = {};
    this.participants = {};
    this.results = {};
    this.state = true;
}

Game.prototype= {
    init : function(masterData, dataNumber){

        if(
            !dataNumber ||
            dataNumber < 1 ||
            dataNumber > masterData.length
        )
        {
            dataNumber = masterData.length;
        }

        // マスターデータをシャッフルして指定の数だけ抜き出す
        this.data = masterData.slice(0);
        this.data.shuffle();
        this.data = this.data.slice(0,dataNumber);
        
        // 札に表示する値をcontentとして持つ
        // TODO 修正すること
        for(var i=0, l = this.data.length; i<l; i++)
        {
            this.data[i].content = this.data[i].uta_shimo;
        } 
        
        this.utaList = new UtaList(this.data);
        this.utaList.list.shuffle();
        this.fudaList = new FudaList(this.data);
        this.fudaList.list.shuffle();
    },
    
    load : function(loadData){
        this.data = loadData.data;
        this.utaList = new UtaList(loadData.utaList.list);
        this.fudaList = new FudaList(loadData.fudaList.list);
        this.state = loadData.state;
        this.participants = loadData.participants;
        this.results = loadData.results;
    },

    getCurrentUta: function(){
        var number = this.utaList.list[0].number;
        var curUta = null;
        
        for(var i =0, l = this.data.length; i < l; i++)
        {
            if( number == this.data[i].number )
            {
                curUta = this.data[i];
                break;
            }
        }
        return curUta;
    },

    getUta: function(number)
    {
        var uta = null;
        
        for(var i =0, l = this.data.length; i < l; i++)
        {
            if( number == this.data[i].number )
            {
                uta = this.data[i];
                break;
            }
        }
        return uta;

    },

    getFuda: function(fudaId, userId){
        var fuda = this.fudaList.getItem(fudaId);
        
        fuda.visibility = "hidden";
        
        this.fudaList.setFudaColorDefault();
        
        this.results[fuda.number] = userId;
        //console.log(this.results)
        //console.log(fuda.number + " " + userId);

        this.utaList.deleteFirstUta();
        
        if( this.utaList.list.length == 0 )
        {
            this.state = false;
        }
    },

    otetsuki: function(fudaId)
    {
        var fuda = this.fudaList.getItem(fudaId);
        fuda.background = "gray";
    },

}


