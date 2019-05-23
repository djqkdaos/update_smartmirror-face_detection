
function Face_Detection($scope, $http, SpeechService, Focus, CalendarService, $interval) {

		global.faceRectangle = {
			height: 235,
			left: 758,
			top: 517,
			width:235
		};
		global.faceDetection = {
			 "emotion": {
			  "anger": 0.1,
			  "contempt": 0.1,
			  "disgust": 0.1,
			  "fear": 0.1,
			  "happiness": 0.1,
			  "neutral": 0.1,
			  "sadness": 0.1,
			  "surprise": 0.1
			 }
		};
		var config2 = require("/home/pi/smart-mirror/config2.json");
		var filename;
		var chart;
		var chartData;
		var exec = require('child_process').exec;
			console.debug('얼굴인식 컨트롤러 추가 완료');
		var emailHeader ;
		var uName = "";
		var axios = require("axios");
		const MSCSFACEAPI = require("mscs-face-api");
		var Key = '6d8d7bcb961444ffb6110cf26b6845c7';
		var useServer = 'WCUS';
		var mscsfa = new MSCSFACEAPI(Key,"WCUS");
		var personGroupId = 'ditsmartmirrorgroup';
		var confidenceThreshold = 0.5;
		var userData = 'dit smart mirror team';
		var faceUrl = "";

		window.onload =	nv.addGraph(function() {
							  chart = nv.models.pieChart()
									.x(function(d) {
									return d.label
								  })
									.y(function(d) {
									return d.value
								  })
									.showLabels(true)
									.showLegend(false)
									.labelThreshold(.05)
									.labelType("key")
									.color(['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#e6f598', '#3288bd', '#66c2a5'])
									.tooltipContent(
									function(key, y, e, graph) { return 'Custom tooltip string' }
								  ) // This is for when I turn on tooltips
									.tooltips(false)
									.donut(true)
									.donutRatio(0.35);

								// Insert text into the center of the donut
								function centerText() {
										return function() {
									var svg = d3.select("svg");

									var donut = svg.selectAll("g.nv-slice").filter(
									  function (d, i) {
										return i == 0;
									  }
									);

									dount.insert("text", "g")
								   .attr("text-anchor", "middle")
								   .text("center")
								    .style("fill", "#fff");


								  }
								}

							  chartData =  d3.select("#donut-chart svg");
							  // Put the donut pie chart together
							  chartData.datum(seedData()).transition().duration(300).call(chart);

							nv.utils.windowResize(chart.update);

							 return chart;
						});





				// data to populate donut pie chart
			function seedData() {
				  return [
					{
					  "label": "화남",
					  "value": global.faceDetection.emotion.anger
					},
					{
					  "label": "경멸",
					  "value": global.faceDetection.emotion.contempt
					},
					{
					  "label": "역겨움",
					  "value": global.faceDetection.emotion.disgust
					},
					{
					  "label": "두려움",
					  "value": global.faceDetection.emotion.fear
					},
					{
					  "label": "행복",
					  "value": global.faceDetection.emotion.happiness
					},
					{
					  "label": "중립",
					  "value": global.faceDetection.emotion.neutral
					},
					{
					  "label": "슬픔",
					  "value": global.faceDetection.emotion.sadness
					},
					{
					  "label": "놀람",
					  "value": global.faceDetection.emotion.surprise
					}
				  ];
			};

			function updateChart(){
			 var data = seedData();
				d3.select("#donut-chart svg")
					.datum(data)
					.transition()
					.duration(300)
					.call(chart);
				nv.utils.windowResize(chart.update);
			};



	function imapSevice(uName){
		var imaps = require('imap-simple');
				var userI ;
				var count=0 ;
				for(var i =0; i<config.userData.length; i++){
					if(config.userData[i].userName == global.name){
						userI = config.userData[i].email;
						count++;
					}

					}
				if(count == 0){
					if(responsiveVoice.voiceSupport()) {
						responsiveVoice.speak(global.name+"님 이메일을 등록해주세요.","Korean Female");
					}
				}
				var emailConfig = {
					imap: {
						user: userI.id,
						password: userI.password,
						host: 'imap.gmail.com',
						port: 993,
						tls: true,
						authTimeout: 3000
					}

				};
				imaps.connect(emailConfig).then(function (connection) {



					return connection.openBox('INBOX').then(function () {

						var delay = 24 * 3600 * 1000;
						var yesterday = new Date();
							yesterday.setTime(Date.now() - delay);
							yesterday = yesterday.toISOString();

						var searchCriteria = ['UNSEEN', ['SINCE', yesterday]];


						var fetchOptions = {
							bodies: ['HEADER', 'TEXT'],
							markSeen: false
						};

						return connection.search(searchCriteria, fetchOptions).then(function (results) {
							var subjects = results.map(function (res) {
								return res.parts.filter(function (part) {
									return part.which === 'HEADER';
								})[0].body.subject[0];
							});

							console.log(subjects);




							var emailUl = document.getElementById("emailUl");

							while(emailUl.firstChild){
								emailUl.removeChild(emailUl.firstChild);
							}

							for(var i=0; i<subjects.length; i++){
							var node = document.createElement("LI");                 // Create a <li> node
							var textnode = document.createTextNode(subjects[i]);         // Create a text node
							node.appendChild(textnode);
							document.getElementById("emailUl").appendChild(node);
							}

						});
					});
				});

	}
	function detectedFace(){

		var faceDiv = document.createElement('DIV');
		faceDiv.className = "face";

		faceDiv.style.left = global.faceRectangle.left*0.55;
		faceDiv.style.top = global.faceRectangle.top*0.176;
		faceDiv.style.height = global.faceRectangle.heigth*0.176;
		faceDiv.style.width = global.faceRectangle.width*0.55;
		var contentDiv = document.getElementById('faceDetectionContent');
		contentDiv.appendChild(faceDiv);

	}



	//사진에서 얼굴 찾기

	function findInPicture(){
		var removeImg = document.getElementById('picture');

		var contentDiv = document.getElementById('faceDetectionContent');

		while(contentDiv.firstChild){
				contentDiv.removeChild(contentDiv.firstChild);
		}


		var img = document.createElement('img');
		img.className = "picture";
		img.id = "picture";// 이미지 객체 생성
		var imageDiv = document.createElement('div');

		imageDiv.className = "picture-container";
        img.src = '/home/pi/smart-mirror/face_img/' + filename; // 이미지 경로 설정 (랜덤)
		imageDiv.appendChild(img);
		contentDiv.appendChild(imageDiv); // board DIV 에 이미지 동적 추가
		/*
		  $('.face').remove();

		  $('#picture').faceDetection({
			complete: function (faces) {
			  for (var i = 0; i < faces.length; i++) {
				$('<div>', {
				  'class':'face',
				  'css': {
					'position': 'absolute',
					'left':   faces[i].x * faces[i].scaleX + 'px',
					'top':    faces[i].y * faces[i].scaleY + 'px',
					'width':  faces[i].width  * faces[i].scaleX + 'px',
					'height': faces[i].height * faces[i].scaleY + 'px'
				  }
				})
				.insertAfter(this);
			  }
			},
			error:function (code, message) {
			  alert('Error: ' + message);
			}
		  });
	*/
	}//사진에서 얼굴찾기 함수 끝
	//구글 클라우드 스토리지 2019

    // 얼굴인식 커맨드 추가
	SpeechService.addCommand('face_detection', function () {
		// Imports the Google Cloud client library.
const {Storage} = require('@google-cloud/storage');

// Instantiates a client. If you don't specify credentials when constructing
// the client, the client library will look for credentials in the
// environment.
const storage = new Storage({
  projectId: 'smart-mirror-239305',
  keyFilename: '/home/pi/smart-mirror/plugins/face_detection/gcs_keyfile.json'
});
// Makes an authenticated API request.

storage
  .getBuckets()
  .then((results) => {
    const buckets = results[0];

    console.log('Buckets:');
    buckets.forEach((bucket) => {
      console.log(bucket.name);
    });
  })
  .catch((err) => {
    console.error('ERROR111:', err);
  });
	var bucketName = "smartmirrortest"
	var filename = "/home/pi/Pictures/duck.jpeg"
	storage.bucket(bucketName).upload(filename, {
	    // Support for HTTP requests made with `Accept-Encoding: gzip`
	    gzip: true,
	    // By setting the option `destination`, you can change the name of the
	    // object you are uploading to a bucket.
	    metadata: {
	      // Enable long-lived HTTP caching headers
	      // Use only if the contents of the file will never change
	      // (If the contents will change, use cacheControl: 'no-cache')
	      cacheControl: 'public, max-age=31536000',
	    },
	  });

	  console.log(`${filename} uploaded to ${bucketName}.`);
// 		function interval(){
//
// 				var bucketName = 'smartmirrortest'
// 				var testimg = "/home/pi/Pictures/duck.jpeg"
// 				//uploadFile(bucketName,testimg);
//
// 				const {Storage} = require('@google-cloud/storage');
//
// 				// Instantiates a client. If you don't specify credentials when constructing
// 				// the client, the client library will look for credentials in the
// 				// environment.
// 				const storage = new Storage();
//
// 				// Makes an authenticated API request.
// 				storage
// 				  .getBuckets()
// 				  .then((results) => {
// 				    const buckets = results[0];
//
// 				    console.log('Buckets:');
// 				    buckets.forEach((bucket) => {
// 				      console.log(bucket.name);
// 				    });
// 				  })
// 				  .catch((err) => {
// 				    console.error('ERROR:', err);
// 				  });
//
// 				//-----------------------------------------------------------------------------20190521보호
// 				// Reference an existing bucket.
// 				//var bucket = gcs.bucket(bucketName);
//
// 				// Upload a local file to a new file to be created in your bucket.
// 				/*bucket.upload('/home/pi/smart-mirror/face_img/'+formatted+'face.jpg', function(err, file) {
//  					 if (!err) {
//   					  bucket.file(filename).makePublic().then(() => {
// 						console.log(`gs:${bucketName}/${filename} is now public.`);
// 						$scope.face = "얼굴인식 중";
// 						setTimeout(findInPicture,500);
// 						$scope.faceUrl = faceUrl;
//
// 						setTimeout(faceDetectionInterval,2000);
// 						//setTimeout(faceidentifyInterval, 5500);
// 						setTimeout(userCheck, 7000);
// 						//setTimeout(emotionCheck,4500);
// 						//setTimeout(del_Face,10000);
//
//
//
// 						}).catch((err) => {
// 						console.error('ERROR:', err);
// 				});
//  				}
// 			});*/
// //-----------------------------------------------------------------------------------------------------------------
//
//
//
// 		}
//
// 			//그룹 트레이닝
// 			/*mscsfa.trainPersonGroup(personGroupId).then(function () {
// 					console.log("트레이닝 후 그룹 상태 보기");
// 					mscsfa.getPersonGroupTrainingStatus(personGroupId).then(function(){ console.log("체인성공") });
//
// 				}, function (error) {
// 					// 실패시
// 					console.error(error);
// 				}).catch(function (err) {
// 						reject(err.response.data.error);
// 						console.log(res.data);
// 				 });*/
//
// 		global.name ="";
// 		global.faceIds = [""];
// 		global.faceDetection = {
// 			 "emotion": {
// 			  "anger": 0.1,
// 			  "contempt": 0.1,
// 			  "disgust": 0.1,
// 			  "fear": 0.1,
// 			  "happiness": 0.1,
// 			  "neutral": 0.1,
// 			  "sadness": 0.1,
// 			  "surprise": 0.1
// 			 }
// 		};
//
// 		global.name ="";
// 		/*var emailUl = document.getElementById("emailUl");
//
// 		while(emailUl.firstChild){
// 					emailUl.removeChild(emailUl.firstChild);
// 		}*/
//
// 		updateChart();
//
//
//
// 		//------------------------------------------------
// 		if(responsiveVoice.voiceSupport()) {
//           responsiveVoice.speak("감정분석을 시작합니다.","Korean Female");
//         }
// 		//------------------------------------------------
// 		var fs = require('fs');
//
// 		/*global.gcs = require('@google-cloud/storage')({
//   					projectId: 'smart-mirror-239305',
//  					keyFilename: '/home/pi/smart-mirror/plugins/face_detection/gcs_keyfile.json'
// 				});*/
//
// 		var datetime = require('node-datetime');
// 		var dt = datetime.create();
// 		var formatted = dt.format('YmdHMS');
//
//
//
// 		//raspistill  -w 1920 -h 1080 -t 3000 -p '300,600,500,500' -o /home/pi/smart-mirror/face_img/"+formatted+'face.jpg
// 		child = exec("fswebcam -r 1920x1080  --no-banner  /home/pi/smart-mirror/face_img/"+formatted+'face.jpg',
// 		//child = exec("fswebcam --set brightness=0% -r 1920x1080  --no-banner  /home/pi/smart-mirror/face_img/"+formatted+'face.jpg',
//   			function (error, stdout, stderr) {
//     		console.log('stdout: ' + stdout);
//     		console.log('stderr: ' + stderr);
// 			setTimeout(interval, 2000);
//     		if (error !== null) {
//      	 console.log('exec error: ' + error);
//   					  }
// 		});
// 		filename = formatted+'face.jpg';
// 		faceUrl = 'https://storage.googleapis.com/smartmirrortest/'+filename;
//
//
//
// 		//face detection
//
//
//
// 	var personImage = faceUrl;
//
// 	//mscsfa.trainPersonGroup(personGroupId);
// 	//mscsfa.getPersonGroupTrainingStatus(personGroupId);
// 	//mscsfa.getPersonGroup(personGroupId);
//
// 	function faceDetectionInterval(){
//
//
//
// 	console.log(faceUrl+"을 분석합니다.");
// 	mscsfa.detectFace(faceUrl).then(function () {
// 			console.log("디텍트 이미지 전송 성공");
// 			setTimeout(function(){
// 				if(global.faceIds[0] != ""){
//
// 				mscsfa.identifyFace(personGroupId,confidenceThreshold).then(function(){
//
// 					setTimeout(function(){
// 						console.log("아이덴티파이 체인성공");
// 						//userCheck();
// 					},2000);
//
// 				}).catch(function (err) {
// 					reject(err.response.data.error);
// 					console.log(res.data);
// 				});
//
// 				}else{
//
// 					var contentDiv = document.getElementById('faceDetectionContent');
//
// 					while(contentDiv.firstChild){
// 							contentDiv.removeChild(contentDiv.firstChild);
// 					}
//
// 					/*if(responsiveVoice.voiceSupport()) {
// 						 responsiveVoice.speak("주인님 다시한번 사용자인증 해주세요.","Korean Female");
// 					}*/
//
// 					var node = document.createElement("h2");                 // Create a <li> node
// 					var textnode = document.createTextNode("주인님  다시한번 사용자 인증 해주세요.");         // Create a text node
// 					//node.appendChild(textnode);
// 					contentDiv.appendChild(node);
//
// 				}
//
// 			}, 2000);
//
// 		}).catch(function (err) {
//                 reject(err.response.data.error);
// 				console.log(res.data);
//          });
//
// 	}
//
// 	function userCheck(){
//
// 		var pI = global.personId;
// 		console.log(pI);
// 		updateChart();
// 		if(global.personId != undefined && global.personId != ""){
//
// 			global.name  = config2.faceDetection.personId[pI];
// 			console.log(global.name);
// 			$scope.face = global.name+"님 어서오세요.";
// 			 if(responsiveVoice.voiceSupport()) {
// 				 responsiveVoice.speak(global.name+"님 어서오세요.","Korean Female");
// 			 }
//
// 			 //$scope.confidenceCheck = "신뢰도 " +global.confidence*100 +"% 일치";
//
//
// 			 console.log($scope.confidenceCheck);
// 			updateChart();
// 			//setTimeout(confidence_voice,4000);
// 			setTimeout(emotionCheck,8000);
// 			getCalendar();
// 			$interval(getCalendar, config.calendar.refreshInterval * 60000 || 1800000);
// 			 global.personId = "";
// 			config2.faceDetection.faceId = [];
// 			if(global.confidence>0.6){
// 				mscsfa.addPersonFace(personGroupId, pI, userData, faceUrl);
// 			}
// 			imapSevice(global.name);
//
//
//
// 		}else{
// 			var contentDiv = document.getElementById('faceDetectionContent');
//
// 				while(contentDiv.firstChild){
// 						contentDiv.removeChild(contentDiv.firstChild);
// 				}
// 				setTimeout(function(){
// 				/*if(responsiveVoice.voiceSupport()) {
// 					 responsiveVoice.speak("주인님 사용자등록후에 사용자인증 해주세요.","Korean Female");
// 				}*/
// 				},3000);
//
// 		}
//
//
// 	}
// 		function confidence_voice(){
// 			if(responsiveVoice.voiceSupport()) {
// 				 responsiveVoice.speak("신뢰도"+parseInt(global.confidence*100)+"% 일치합니다.","Korean Female");
// 			}
// 		}
//
// 	//------------------------------------storege face pic delete----------------------------------
//
// 		function del_Face(){
// 				// The name of the bucket to access, e.g. "my-bucket"
// 				var bucketName = 'smartmirrortest'
//
// 				// The name of the file to delete, e.g. "file.txt"
// 				 const filename = formatted+'face.jpg';
//
// 				// Instantiates a client
//
//
// 				// Deletes the file from the bucket
// 				gcs
// 				  .bucket(bucketName)
// 				  .file(filename)
// 				  .delete()
// 				  .then(() => {
// 					console.log(`gs://${bucketName}/${filename} deleted.`);
// 				  })
// 				  .catch((err) => {
// 					console.error('ERROR:', err);
// 				  });
// 			}
// 		//-----------------------------------------------------------------------------------------------
// 	function emotionCheck(){
//
// 		var contentDiv = document.getElementById('faceDetectionContent');
//
// 		while(contentDiv.firstChild){
// 				contentDiv.removeChild(contentDiv.firstChild);
// 		}
//
// 		//var h2 = document.createElement('h2');
// 		//h2.style.font-color="white";
// 		//h2.className = "picture";
// 		//h2.innerHTML = "<font color='white'>신뢰도"+global.confidence*100+"% 일치</font>";
//
// 		console.log('이거 실행');
//
// 		//var textnode = document.createTextNode(subjects[i]);         // Create a text node
// 		//h2.appendChild("신뢰도 " +global.confidence*100 +"% 일치");
// 		//contentDiv.appendChild(h2);
// 		if(global.faceDetection.emotion.anger>=0.5) {
//
// 			  $scope.face = "화가 나셨네요 왜 그런지 모르겠지만 기분 푸세요~";
// 			  if(responsiveVoice.voiceSupport()) {
// 				 responsiveVoice.speak(global.name+"님 화가 나셨나보네요 come down 진정하세요.","Korean Female");
// 			}
//
// 		}else if(global.faceDetection.emotion.contempt>=0.5){
// 			if(responsiveVoice.voiceSupport()) {
// 				 responsiveVoice.speak(global.name+"님 왜 그런눈으로 보세요 그러면 슬퍼요..","Korean Female");
// 			}
//
// 		}else if(global.faceDetection.emotion.disgust>=0.5){
// 			if(responsiveVoice.voiceSupport()) {
// 				 responsiveVoice.speak(global.name+"님 왜 그런눈으로 보세요 그러면 슬퍼요..","Korean Female");
// 			}
// 		}else if(global.faceDetection.emotion.fear>=0.5){
// 			if(responsiveVoice.voiceSupport()) {
// 				 responsiveVoice.speak(global.name+"님 무서워 하지마세요 경찰을 불렀으니까요.","Korean Female");
// 			}
// 		}else if(global.faceDetection.emotion.happiness>=0.5){
// 			if(responsiveVoice.voiceSupport()) {
// 				 responsiveVoice.speak(global.name+"님 오늘 기분이 좋아 보이시네요 주인님을보니 저도 행복해요.","Korean Female");
// 			}
// 		}else if(global.faceDetection.emotion.neutral>=0.5){
// 			$scope.face = "화가 나셨네요 왜 그런지 모르겠지만 기분 푸세요~";
// 			if(responsiveVoice.voiceSupport()) {
// 				 responsiveVoice.speak(global.name+"님 오늘도 즐거운 하루 보내세요","Korean Female");
// 			}
// 		}else if(global.faceDetection.emotion.sadness>=0.5){
// 			if(responsiveVoice.voiceSupport()) {
// 				 responsiveVoice.speak(global.name+"님 슬퍼 하지마세요 제가 있짢아요 찡긋","Korean Female");
// 			}
// 		}else if(global.faceDetection.emotion.surprise>=0.5){
// 			if(responsiveVoice.voiceSupport()) {
// 				 responsiveVoice.speak(global.name+"님 왜 그렇게 놀라셨죠? 컬러페라피로 진정하시는건 어때요?","Korean Female");
// 			}
// 		}
// 	}
//
// 	function faceidentifyInterval(){
// 	detectedFace();
// 	mscsfa.identifyFace(personGroupId,confidenceThreshold).then(function (res) {
//                     resolve(res.data);
// 					learningFace();
//                 }).catch(function (err) {
//                     reject(err.response.data.error);
// 					console.log(err.response.data.error);
//                 });
//
// 	}
//
// 	function learningFace(){
// 		if(global.confidence>0.5)
// 		mscsfa.addPersonFace(personGroupId, global.personId, userData, faceUrl);
// 	}
// 	//트레이닝
// 		var getCalendar = function(){
// 		CalendarService.getCalendarEvents().then(function () {
// 			$scope.calendar = CalendarService.getFutureEvents();
// 		}, function (error) {
// 			console.log(error);
// 		});
// 	}
//
// 		//여기 까지




		$scope.face = "얼굴인식 중";

		Focus.change("face_detection");
	});

}

angular.module('SmartMirror')
    .controller('Face_Detection', Face_Detection);
