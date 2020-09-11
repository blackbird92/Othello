function testPlayer1(){
	pick = Math.floor(Math.random() * player_put_array.length)
	prepareRevers(player_put_array[pick])
}

function testPlayer2(){
	stack_put_array = ai_put_array.slice()

	retention_count = []
	for(search = 0; search < ai_put_array.length; search++){
		if(reverse(stack_put_array[search],play_selector,returnRival(),0) == 1){
			retention_count.push(countRetantion())
		}
	}

	max_retention = Math.max.apply(null, retention_count)
	max_index = retention_count.indexOf(max_retention)
	max_postion = ai_put_array[max_index]

	prepareRevers(max_postion)

}

function testPlayer3(){
	var stack_put_array = player_put_array.slice()
	var stack_score = 0;
	var stack_index = 0;
	var retention_count = []
	var aiplayer
	var manplayer
	stack_board_status = board_status.slice()
	stack_aiuse_status = aiuse_status.slice()

	for(search_ai = 0; search_ai < stack_put_array.length; search_ai++){
		if(reverse(stack_put_array[search_ai], play_selector, returnRival(), 0) == 1){
			board_status = aiuse_status.slice()
			put_array = []
			for(p = 0; p < aiuse_status.length; p++){
				if(reverse(p, 1, 2, 0) == 1){
					put_array.push(p)
				}
			}
			aiuse_status = []
			aiuse_status = stack_board_status.slice()

			for(second = 0; second < put_array.length; second++){
				if(reverse(put_array[second], 2,1,0) == 1){
				}
			}

			white_retantion = countRetantion()
			console.log(white_retantion)

			aiuse_status = stack_aiuse_status.slice()
			if(stack_score){
				for(var plus = 1; plus < 15; plus++){
					if(stack_score + plus < white_retantion){
						stack_score = white_retantion
						stack_index = stack_put_array[search_ai]
					}
				}
			}else{
				stack_score = white_retantion
				stack_index = stack_put_array[search_ai]
			}
		}
	}
			
	board_status = stack_board_status.slice()
	prepareRevers(stack_index)
}

function testPlayer4(){
	var first_shot = 1;
	var stack_put_array = player_put_array.slice()
	var stack_score_white = 0;
	var stack_score_black = 0;
	var stack_index = 0;
	var retention_count = []
	var aiplayer
	var manplayer

	// 何手目まで読むか
	var stack_board_status = board_status.slice()
	var stack_aiuse_status = aiuse_status.slice()

	for(search_ai = 0; search_ai < stack_put_array.length; search_ai++){
		// 板情報を初期化
		board_status = stack_board_status.slice()
		if(reverse(stack_put_array[search_ai], play_selector, returnRival(), 0) == 1){
			console.log("AIが" + stack_put_array[search_ai] + "に置く")
			// 一手目で置いたときの黒の数
			
			white_retantion = countRetantion(play_selector)
			console.log("white: " + white)

			board_status = aiuse_status.slice()
			//　ここではaiuse_arrayは↑で置いたときの状態になってる

			// プレーヤーの置ける場所取得
			put_array = []
			for(p = 0; p < aiuse_status.length; p++){
				if(reverse(p, returnRival, play_selector, 0) == 1){
					put_array.push(p)
				}
			}

			console.log("プレーヤーの置ける場所: "+ put_array)
			// 今put_arrayは２手目でプレーヤーが置ける場所になってる

			aiuse_status = []
			aiuse_status = stack_board_status.slice()


			// aiプレーヤーの置ける場所取得
			for(second = 0; second < put_array.length; second++){
				if(reverse(put_array[second], play_selector, returnRival(), 0) == 1){
				}
			}

			black_retantion = countRetantion(returnRival())
			console.log("black: " +black_retantion)

			// white_retantion : １手目の白の枚数
			// black_retantion : ２手目の黒の枚数

			// aiuse_statusリセット
			aiuse_status = stack_aiuse_status.slice()
			if(stack_score_white && stack_score_black){
				for(var plus = 2; plus < 10; plus++){
					for(var minas = 5; minas >= 0; minas--){
						if(stack_score_white + plus < white_retantion && stack_score_black - minas > black_retantion){
							stack_white_score = white_retantion
							stack_index = stack_put_array[search_ai]
						}else{
							console.log("該当しません。")
						}
					}
				}
			}else{
				stack_score_white = white_retantion
				stack_score_black = black_retantion
				stack_index = stack_put_array[search_ai]
			}
		}
	}
	
	board_status = stack_board_status.slice()
	prepareRevers(stack_index)

}
