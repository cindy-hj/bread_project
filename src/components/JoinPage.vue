<template>
    <div class="wrap">
        <el-form
            :model="form"
            label-width="120px"
        >
            <el-form-item label="이름">
                <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="이메일">
                <el-input style="width: 151px;" v-model="form.email_id" />
                <span>@</span>
                <el-select
                    v-model="form.email_add"
                    placeholder="이메일 주소를 선택하세요"
                >
                    <el-option
                        label="google.com"
                        value="google"
                    />
                    <el-option
                        label="naver.com"
                        value="naver"
                    />
                    <el-option
                        label="daum.net"
                        value="daum"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="Activity time">
                <el-col :span="11">
                    <el-date-picker
                        v-model="form.date1"
                        type="date"
                        placeholder="Pick a date"
                        style="width: 100%"
                    />
                </el-col>
                <el-col
                    :span="2"
                    class="text-center"
                >
                    <span class="text-gray-500">-</span>
                </el-col>
                <el-col :span="11">
                    <el-time-picker
                        v-model="form.date2"
                        placeholder="Pick a time"
                        style="width: 100%"
                    />
                </el-col>
            </el-form-item>
            <el-form-item label="Instant delivery">
                <el-switch v-model="form.delivery" />
            </el-form-item>
            <el-form-item label="Activity type">
                <el-checkbox-group v-model="form.type">
                    <el-checkbox
                        label="Online activities"
                        name="type"
                    />
                    <el-checkbox
                        label="Promotion activities"
                        name="type"
                    />
                    <el-checkbox
                        label="Offline activities"
                        name="type"
                    />
                    <el-checkbox
                        label="Simple brand exposure"
                        name="type"
                    />
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="성별">
                <el-radio-group v-model="form.gender">
                    <el-radio label="남" />
                    <el-radio label="여" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="Activity form">
                <el-input
                    v-model="form.desc"
                    type="textarea"
                />
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    @click="onSubmit"
                    >Create</el-button
                >
                <el-button>Cancel</el-button>
            </el-form-item>
        </el-form>
    </div>  
</template>

<script>
import { reactive } from 'vue';

export default {
    setup() {

        const form = reactive({
            name: '',
            email_id: '',
            email_add: '',
            date1: '',
            date2: '',
            delivery: false,
            type: [],
            gender: '',
            desc: '',
            })

        const onSubmit = () => {
            console.log('submit!')
        }

        return {
            form,
            onSubmit
        };
    }
};
</script>

<style lang="css" scoped>
.wrap{
    margin: 20px auto;
    width: 500px;
}
</style>
