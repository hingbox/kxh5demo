/**
 * Created by tangy on 2017/2/14.
 */
/**
 * 渲染折线图
 * @param elm
 *        所渲染折线图的html元素容器
 * @param data.title
 *        标题
 * @param data.subText
 *        副标题
 * @param data.legend
 *        图列 数组类型
 * @param data.splitLineData
 *        X轴辅助线  数组类型
 * @param data.splitLineColor
 *        X轴辅助线色值
 * @param data.xAxisData
 *        X轴刻度数据  数组类型
 * @param data.series
 *        渲染图标所需折线数据  数组类型
 */
var renderAxisCharts = function(elm, data){
    //初始化Echart控件
    var myChart = echarts.init(document.getElementById(elm));
    //设置Echart属性
    option = {
        title: {
            text: data.title,
            subtext: data.subText
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: data.legend,
            bottom: 0
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {readOnly: false},
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis:  {
            type: 'category',
            boundaryGap: false,
            splitLine:{
                show:true,
                interval:function(index,value){
                    for(var i=0;i<data.splitLineData.length;i++){
                        if(data.splitLineData[i]==value)
                            return true;
                    }
                },
                lineStyle: {
                    color: typeof(data.splitLineColor) == "undefined"?"#eeeee":data.splitLineColor,
                    width: 2
                }
            },
            data: data.xAxisData
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            },
            splitLine:{
                show: true,
                lineStyle: {
                    color: '#eeeee',
                    width: 0.1
                }
            }
        },
        series: data.series
    };
    myChart.setOption(option);
};