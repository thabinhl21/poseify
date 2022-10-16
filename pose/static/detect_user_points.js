let video;
let pose;
let poseNet;
let skeleton;
let keypoints_smooth = 
[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],
[0,0],[0,0],[0,0],[0,0],[0,0]];
let save_images = [];
let time_counter = 0;
function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.hide()
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);
    frameRate(20);
  }
function gotPoses(poses){
    //console.log(poses);
    if(poses.length > 0){
        console.log(poses);
        pose = poses[0].pose;
        skeleton = poses[0].skeleton;
    }
}

function draw(){
    time_counter ++;
    background(255);
    image(video,0,0);
    if(pose){
        for(let i = 0; i < pose.keypoints.length; i++){
            if(pose.keypoints[i].part.includes("right")){
                fill(0,255,0);
            }else{
                fill(255,0,0);
            }
            if(pose.keypoints[i].score>0.7){
                keypoints_smooth[i]=[lerp(keypoints_smooth[i][0], pose.keypoints[i].position.x,0.5),lerp(keypoints_smooth[i][1],pose.keypoints[i].position.y, 0.5)];
                ellipse(keypoints_smooth[i][0], keypoints_smooth[i][1], 15);    
            }
        }
        noFill();
        stroke(255,0,0);
        ellipse(keypoints_smooth[0][0], keypoints_smooth[0][1], Math.abs(keypoints_smooth[1][0]-keypoints_smooth[2][0])*2.5,Math.abs(keypoints_smooth[1][0]-keypoints_smooth[2][0])*2.7);
        strokeWeight(2);
        stroke(255,0,0);
        let connections = [[5,7], [7,9], [6,8],[8,10], [5,11], [6,12], [11,13], [12, 14], [13,15], [14, 16], [5,6], [11,12]]
            for(let i = 0; i < connections.length; i++){
                let p1 = keypoints_smooth[connections[i][0]]
                let p2 = keypoints_smooth[connections[i][1]]
                if(p1[0] > 1 && p1[1]>1 && p2[0] > 1 && p2[1]>1){
                    line(p1[0], p1[1], p2[0], p2[1])
                }
            }
    }
    if(time_counter%100 == 0){
        save_images.push(keypoints_smooth);
        console.log(save_images.length);
    }

}
function modelLoaded() {
    console.log('Model Loaded!');
  }