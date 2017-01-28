<div class="center-block">
	<div class="portlet-body">
		<div class="panel-group" id="accordion">
			<div class="panel panel-default">
				<div class="panel-heading panel-heading-custom"
					data-toggle="collapse" data-parent="#accordion"
					data-target="#collapseOne">
					<h6 class="panel-title pane-title-custom">
						<a class="accordion-toggle"> <b>User Details</b>
						</a>
					</h6>
				
				</div>
				<div id="collapseOne" class="panel-collapse collapse in">
					<div class="panel-body">
					<div id="ajaxResults"></div>
						<div class="portlet-title">
							<div class="actions"
								style="margin-bottom: 10px; margin-top: 10px; text-align: right;">

								<div class="btn-group">
									<a data-toggle='modal'  data-backdrop='static' data-keyboard='false' onclick="profile_update('<?php echo $email;?>',<?php echo $id;?>,1,<?php echo $roleId;?>,'<?php echo addslashes($firstName);?>','<?php echo addslashes($lastName);?>','profile')" role="button"
										class="btn blue btn-primary blue_button">Edit</a>
								</div>

							</div>
						</div>
						
						<div class="panel-group accordion" style="margin-top: -45px;" id="user_view_list">
							<div class="col-md-5 col-sm-5 identifydiv">
								<div class="form-group ">
									<label class="col-md-4 control-label" for="status">First Name:</label>
									<div class="col-md-8"><?php echo @$firstName;?></div>
								</div>
							</div>

							<div class="col-md-5 col-sm-5 identifydiv">
								<div class="form-group ">
									<label class="col-md-4 control-label" for="status">Last Name:</label>
									<div class="col-md-4"><?php echo @$lastName;?></div>
								</div>
							</div>

							<div class="col-md-5 col-sm-5 identifydiv">
								<div class="form-group ">
									<label class="col-md-4 control-label" for="status">Email:</label>
									<div class="col-md-8"><?php echo $email;?></div>
								</div>
							</div>

							<div class="col-md-5 col-sm-5 identifydiv">
								<div class="form-group ">
									<label class="col-md-4 control-label" for="status">Role:</label>
									<div class="col-md-4"><?php echo @$role;?></div>
								</div>
							</div>

						</div>

					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="modalprofileform" role="dialog"
	data-backdrop="static" data-keyboard="false">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal"
					aria-hidden="true"></button>
				<h4 class="modal-title">Edit User Profile</h4>
			</div>
			<div id="error-bubble"></div>
			<div class="modal-body">
				<div class="scroller" style="height: 250px" data-always-visible="1"
					data-rail-visible1="1">
					<div class="row" id="showprofile">
						                                             
                    </div>
						<div id="ajaxloaderprofile"></div>
				</div>
			</div>

		</div>
	</div>
</div>