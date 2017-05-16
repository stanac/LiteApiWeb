var services = require('./services/httpService');
var codeHelpers = require('./services/codeHelpers');

module.exports = {
	route: {
		canReuse: false,
	},
	template: `
		<div class="row off-top" v-if="post">
			<div class="col-md-12"><h2>{{ post.title }}</h2></div>
			<div class="col-md-12">{{ post.formatedCreatedDate }} by {{ post.author }}</div>
			<div class ="col-md-12">
				<br/><br/>
			</div>
			<div class="col-md-12" v-html="post.contentHtml"></div>
		</div>
`,
	data() {
		return {
			post: null
		}
	},
	watch: {
		'$route': 'loadData'
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.post = null;
			$(window).scrollTop(0);
			let id = this.$route.params.id;
			services.blogService.getPost(id, (res) => {
				this.post = JSON.parse(res);
				codeHelpers.highlight();
			});
		}
	}

}