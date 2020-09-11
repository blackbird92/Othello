var outside = [1,2,3,4,5,6,7,8,9,17,25,33,41,49,57,16,24,32,40,48,56,64,58,59,60,61,62,63]
var corner = [1,8,57,64]
// AIが置いた後のプレーヤーの配置可能場所
var player1_put_array = []
// 優先順位別に次の手が入る
var stack_next_position = {}
// AIが置く前の状態
var stack_board_status = []

// 外周から一番近い場所
var min_until_outside = {}


var stack_min_hand_value;
var stack_min_hand_index;

function aiPlayer(){
	// AIが置ける場所をスタックしておく。
	var stack_put_array = ai_put_array.slice()
	// console.log("AIが置けるのは" + stack_put_array)
	stack_next_position = {}
	min_until_outside = {}
	// プレーヤーが置いた時の状態。これからいじくり回すから状態が変わらないようにスタックしておく
	stack_board_status = board_status.slice()
	stack_min_hand_index = ""
	stack_min_hand_value = ""

	for(var search = 0; search < stack_put_array.length; search++){
		// 板情報をプレーヤーが置いた直後の状態に戻す
		board_status = stack_board_status.slice()

		// 外周にあるか
		if(outside.indexOf(stack_put_array[search]) != -1){
			// 角か
			if(corner.indexOf(stack_put_array[search]) != -1){
				// 角だったときの処理 in here
				stack_next_position[stack_put_array[search]] = '1'
			}else{
				// 置いたときに相手に外周の選択肢があるか
				if(nextHand( stack_put_array[search], "isOustside")){
					// ないからスタック
					stack_next_position[stack_put_array[search].toString()] = '2'
				}else{
					// ブレークってフローには書いてある。再考。
					// 相手の外周を潰せるならそれがいいけど
					stack_next_position[stack_put_array[search].toString()] = '5'
				}
			}
		}else{
			// 置いた時に外周に近いところの提案
			// 相手に外周の脅威がない外周に一番近いところを探すこれはstack_put_array.length文できる
			min_until_outside[stack_put_array[search]] = untilOutside(stack_put_array[search])
			// からの
			// そこに置いたときに相手に外周の選択肢があるか

			// その前にオブジェクトをソート
			// keysには近い順に入ってるからこれでforを回せば良さげ
			var keys=[];
			for(var key in min_until_outside)keys.push(key);
			function Compare(a,b){
				return min_until_outside[a]-min_until_outside[b];    
			}
			keys.sort(Compare);
			// ここまでソート

			var count = 3;
			for(var key in keys){
				if(nextHand( parseInt(keys[key]), "isOustside")){
				// 外周の選択肢がないからスタックしていい
					stack_next_position[( keys[key].toString() )] = '3'
					count++
				}else{
					stack_next_position[( keys[key].toString() )] = '6'
				}
			}

			// 最小手を計算
			var min_hand = nextHand(stack_put_array[search], "minHand", search, stack_put_array.length)
			if( min_hand[0] ){
				stack_next_position[min_hand[1].toString()] = '4'
			}
		}
	}
	console.log(stack_next_position)
	// 後片付けは大事だろ
	board_status = stack_board_status.slice()

	var next_hand;
	for(var i = 7; i >= 1; i--){
		for(var key in stack_next_position){
			if(stack_next_position[key] == i){
				console.log(i + ":" + key)
				next_hand = key
			}
		}
	}

	console.log("AIは" + next_hand + "におく")
	setTimeout(function(){
		prepareRevers(parseInt(next_hand))
	},1500)
}

// 置いた時相手に外周の選択肢があるかないか
function nextHand(target, mode, now_counter, end_counter){
	var before_retantion = 0;
	var after_retantion = 0;
	// あればfalse なれけばtrueを返す

	// プレイヤーが置いた状態に戻す
	board_status = stack_board_status.slice()
	before_retantion = countRetantion(play_selector, 0)

	// AIが置ける場所に置く
	if(reverse(target, play_selector, returnRival(), 0) == 1){
		// console.log("AIが" + target + "に置く")

		// 置いた後の板情報はaiuse_statusに入ってる
		board_status = aiuse_status.slice()
		// 置いた後のカウントする
		after_retantion = countRetantion(play_selector, 1)
		// ↑reverse()はboard_statusから状態を取得してるから状態更新
		// ↓更新した板情報からプレーヤーの置ける場所を取得
		var put_array1 = []
		for(var p = 1; p < aiuse_status.length; p++){
			// 既に置いてある場合をエスケープ
			if(aiuse_status[ p - 1] == 0){
				// 仮想的に置く
				if(reverse(p, returnRival(), play_selector, 0) == 1){
					// reverseからは１が返ってきたらpは置ける場所にある
					// から配列にまとめる
					put_array1.push(p)
				}
			}
		}
		
		// 今put_array1にはプレーヤーが置ける場所が入ってる
		// for(var p = 0; p < put_array1.length; p++){
		// 	$("#" + put_array1[p]).css("backgroundColor","red")
		// }

		// 外周判定なのか最小手の計算なのか。
		if(mode == "isOustside"){
			return isOustside(put_array1)
		}else if(mode == "minHand"){
			// stack_board_status と　ここのboard_statusを比較すればいい
			// で最小になる手を返す？
			if(stack_min_hand_index && stack_min_hand_value){
				if(stack_min_hand_value > parseInt(after_retantion - before_retantion - 1)){
					stack_min_hand_value = parseInt(after_retantion - before_retantion - 1)
					stack_min_hand_index = target
				}
			}else{
				stack_min_hand_value = parseInt(after_retantion - before_retantion - 1)
				stack_min_hand_index = target
			}

			if(now_counter+1 == end_counter){
				return [true, stack_min_hand_index]
			}else{
				return [false, 1000]
			}
		}
	}
}

function isOustside(put_array1){
	// 外周があるか判定
	var in_outside = 1;
	for(var p = 0; p < put_array1.length; p++){
		if(outside.indexOf(put_array1[p]) != -1){
			in_outside = 0;
		}
	}
	if(in_outside == 1){
		// console.log("外周はない")
		return true
	}else{
		console.log("外周がある")
		return false
	}
}

// 外周までの距離を計算して一番小さいものを返す
function untilOutside(target){
	var until_outside = []
	var row = Math.ceil(target / 8)
	until_outside.push( 8 * row - target )
	until_outside.push(8 - (8 * row - target + 1))
	until_outside.push(Math.abs(1 - row))
	until_outside.push(8 - row)

	return Math.min.apply(null, until_outside)
}

// 結果を取得できる
function countRetantion(selector, before_after){
	var retention = 0;
	var dokokara = [];

	if(before_after == 1){
		dokokara = aiuse_status.slice()
	}else if(before_after == 0){
		dokokara = board_status.slice()
	}

	for(var i = 0; i < dokokara.length; i++){
		if(dokokara[i] == selector){
			retention++
		}
	}
	return retention;
}
