let video;
let pose;
let poseNet;
let skeleton;
let keypoints_smooth = 
[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],
[0,0],[0,0],[0,0],[0,0],[0,0]];
let save_images = [];
let final_images = [];
let time_counter = 0;
let recording_flag = true;
let curr_img = 0;
function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.hide()
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);
    frameRate(50);
    button = createButton('Stop Recording and Review Poses');
    button.position(0,500);
    button.mousePressed(reviewPoses);
    
  }
function deepcopy(arr){
    ans = [];
    for(let i = 0; i < arr.length; i++){
        curr =[];
        for(let j = 0; j < arr[i].length; j++){
            curr.push(arr[i][j]);
        }
        ans.push(curr);
    }
    return ans;
}
function reviewPoses(){
    recording_flag = false;
    button.remove();
    button_n = createButton('Next Pose');
    button_n.position(200,500);
    button_n.mousePressed(nextPose);
    button_p = createButton('Prev Pose');
    button_p.position(100,500);
    button_p.mousePressed(prevPose);
    button_s = createButton('Save Pose');
    button_s.position(700,200);
    button_s.mousePressed(addImg);
    console.log(save_images);
}


function gotPoses(poses){
    //console.log(poses);
    if(poses.length > 0 && recording_flag){
        pose = poses[0].pose;
        skeleton = poses[0].skeleton;
    }
}

function draw(){
    if(recording_flag == false){
        background(255);
        noFill();
        stroke(0);
        var diam = Math.abs(save_images[curr_img][1][0]-save_images[curr_img][2][0]);
        ellipse(save_images[curr_img][0][0], save_images[curr_img][0][1], diam*2.5, diam*2.7);
        var startAng = .1*PI
        var endAng = .9*PI
        var smileDiam = .8*diam;
        arc(save_images[curr_img][0][0], save_images[curr_img][0][1], smileDiam, smileDiam, startAng, endAng);
        ellipse(save_images[curr_img][1][0], save_images[curr_img][1][1], 7);
        ellipse(save_images[curr_img][2][0], save_images[curr_img][2][1], 7);
        for(let i = 5; i < save_images[curr_img].length; i++){  
            ellipse(save_images[curr_img][i][0], save_images[curr_img][i][1], 15);        
        }
        let connections = [[5,7,1], [7,9,1], [6,8,0],[8,10,0], [5,11,3], [6,12,3], [11,13,1], [12, 14,0], [13,15,1], [14, 16,0], [5,6,3], [11,12,3]];
        for(let i = 0; i < connections.length; i++){
            let p1 = save_images[curr_img][connections[i][0]]
            let p2 = save_images[curr_img][connections[i][1]]
            if(p1[0] > 1 && p1[1]>1 && p2[0] > 1 && p2[1]>1){
                if(connections[i][2] == 0){
                    stroke(255,0,0);
                }
                else if(connections[i][2] == 1){
                    stroke(0,255,0);
                }
                else{
                    stroke(0);
                }
                line(p1[0], p1[1], p2[0], p2[1]);
            }
        }
    }
    if(recording_flag){
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
        
            if( time_counter%100 == 0){
                save_images.push(deepcopy(keypoints_smooth));
                console.log(save_images.length);
            }
        }  
    }

}
function addImg(){
    final_images.push(curr_img);
    saveCanvas("GIF_"+curr_img, "png");
}
function nextPose(){
    curr_img = Math.min(curr_img+1, save_images.length-1);
    console.log(curr_img);
}
function prevPose(){
    curr_img = Math.max(curr_img-1, 0);
    console.log(curr_img);

}
function modelLoaded() {
    console.log('Model Loaded!');
  }