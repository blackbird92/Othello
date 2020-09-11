function aiPlayer(){
	var stack_put_array = ai_put_array.slice()
	var stack_score_white = 0;
	var stack_score_black = 0;
	var stack_index = 0;
	var retention_count = []

	var not_put = 0

	stack_board_status = board_status.slice()
	stack_aiuse_status = aiuse_status.slice()

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
			for(p = 1; p < aiuse_status.length; p++){
				if(board_status[p - 1] == 0){
					if(reverse(p, returnRival(), play_selector, 0) == 1){
						put_array.push(p)
					}
				}
			}
			console.log("プレーヤーの置ける場所: "+ put_array)
			// 今put_arrayは２手目でプレーヤーが置ける場所になってる
			// プレイヤー１が置ける場所なければパス
			if(put_array.length > 0){
				aiuse_status = []
				aiuse_status = stack_board_status.slice()
				// aiプレーヤーの置ける場所取得
				for(second = 0; second < put_array.length; second++){
					if(reverse(put_array[second], play_selector , returnRival(),0) == 1){
					}
				}

				black_retantion = countRetantion(returnRival())
				console.log("black: " + black_retantion)

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
								console.log("該当しません")
							}
						}
					}
				}else{
					stack_score_white = white_retantion
					stack_score_black = black_retantion
					stack_index = stack_put_array[search_ai + 2]
				}
			}else{
				stack_index = stack_put_array[0]
			}
		}
	}
	
	board_status = stack_board_status.slice()

	setTimeout(function(){
		prepareRevers(stack_index)
	},1500)

}

// 結果を取得できる
function countRetantion(selector){
	retention = 0;
	for(var i = 0; i < aiuse_status.length; i++){
		// このplay_selector多分地雷
		if(aiuse_status[i] == selector){
			retention++
		}
	}

	return retention;
}